import { INSIGHTS } from './constants';

const maxConsecutiveDifferenceWithPositions = (arr) => {
  if (arr.length < 2) return [undefined, undefined];
  let maxDiff = -Infinity;
  let maxDiffPositions = undefined;
  for (let i = 2; i < arr.length; i++) {
    const diff = arr[i - 1] - arr[i];
    if (diff > maxDiff) {
      maxDiff = diff;
      maxDiffPositions = i + 1;
    }
  }
  return [maxDiff, maxDiffPositions];
};

const highestConsecutiveCount = (arr, value) => {
  let maxCount = 0;
  let currentCount = 0;
  for (const element of arr) {
    if (element === value) {
      currentCount++;
      maxCount = Math.max(maxCount, currentCount);
    } else {
      currentCount = 0;
    }
  }
  return maxCount;
};

const calculateInsight = (insightName, games, calculationFunction) => {
  const result = calculationFunction(games);
  return result ? { [insightName]: [result] } : {};
};

const calculateAllInsights = (tournamentGames, insightsToCalculate) => {
  const insights = {};
  let analysedGames = 0;
  let totalGames = tournamentGames.length;

  const insightCalculations = {
    [INSIGHTS.SHORTEST_GAME_BY_MOVES]: (games) => {
      const shortestGame = games.reduce((shortest, game) => {
        const moves = Math.floor(game.moves.split(' ').length / 2);
        return moves > 2 && moves < shortest.moves ? { id: game.id, players: game.players, moves } : shortest;
      }, { moves: Infinity });
      return shortestGame.id ? { gameId: shortestGame.id, players: shortestGame.players, value: shortestGame.moves } : null;
    },
    [INSIGHTS.LONGEST_GAME_BY_MOVES]: (games) => {
      const longestGame = games.reduce((longest, game) => {
        const moves = Math.floor(game.moves.split(' ').length / 2);
        return moves > longest.moves ? { id: game.id, players: game.players, moves } : longest;
      }, { moves: 0 });
      return longestGame.id ? { gameId: longestGame.id, players: longestGame.players, value: longestGame.moves } : null;
    },
    [INSIGHTS.LONGEST_MOVE_BY_TIME]: (games) => {
      let maxDiff = -Infinity;
      let result = null;
      games.forEach(game => {
        const [diffW, positionsW] = maxConsecutiveDifferenceWithPositions(game.clocks.filter((_, i) => i % 2 === 0));
        const [diffB, positionsB] = maxConsecutiveDifferenceWithPositions(game.clocks.filter((_, i) => i % 2 !== 0));
        if (Math.max(diffW, diffB) > maxDiff) {
          maxDiff = Math.max(diffW, diffB);
          result = {
            gameId: game.id,
            players: game.players,
            side: diffW > diffB ? "white" : "black",
            timeTaken: maxDiff / 6000,
            moveNo: diffW > diffB ? positionsW : positionsB
          };
        }
      });
      return result;
    },
    [INSIGHTS.MOST_ACCURATE_GAME]: (games) => {
      const mostAccurateGame = games.reduce((mostAccurate, game) => {
        if (game.players.white.analysis && game.players.black.analysis) {
          const accuracy = (game.players.white.analysis.accuracy + game.players.black.analysis.accuracy) / 2;
          return accuracy > mostAccurate.accuracy ? { id: game.id, players: game.players, accuracy } : mostAccurate;
        }
        return mostAccurate;
      }, { accuracy: 0 });
      return mostAccurateGame.id ? { gameId: mostAccurateGame.id, players: mostAccurateGame.players, value: mostAccurateGame.accuracy } : null;
    },
    [INSIGHTS.MOST_DYNAMIC_GAME]: (games) => {
      const mostDynamicGame = games.reduce((mostDynamic, game) => {
        if (game.analysis) {
          let turnArounds = 0;
          let prevWinning = null;
          game.analysis.forEach(analysis => {
            const whiteWinning = 'eval' in analysis ? analysis.eval > 0 : analysis.mate > 0;
            if (whiteWinning !== prevWinning && prevWinning !== null) turnArounds++;
            prevWinning = whiteWinning;
          });
          return turnArounds > mostDynamic.turnArounds ? { id: game.id, players: game.players, turnArounds } : mostDynamic;
        }
        return mostDynamic;
      }, { turnArounds: 0 });
      return mostDynamicGame.id ? { gameId: mostDynamicGame.id, players: mostDynamicGame.players, value: mostDynamicGame.turnArounds } : null;
    },
    [INSIGHTS.MOST_USED_OPENING]: (games) => {
      const openings = games.reduce((acc, game) => {
        if (game.opening) {
          acc[game.opening.name] = (acc[game.opening.name] || 0) + 1;
        }
        return acc;
      }, {});
      const mostUsedOpening = Object.entries(openings).reduce((a, b) => a[1] > b[1] ? a : b, ['', 0]);
      return mostUsedOpening[1] > 0 ? { openingName: mostUsedOpening[0], noOfTimes: mostUsedOpening[1] } : null;
    },
    [INSIGHTS.MOST_ACCURATE_PLAYER]: (games) => {
      const playerAccuracies = games.reduce((acc, game) => {
        ['white', 'black'].forEach(color => {
          if (game.players[color].analysis) {
            const playerName = game.players[color].user.name;
            if (!acc[playerName]) acc[playerName] = { totalAcc: 0, games: 0 };
            acc[playerName].totalAcc += game.players[color].analysis.accuracy;
            acc[playerName].games++;
          }
        });
        return acc;
      }, {});
      const mostAccuratePlayer = Object.entries(playerAccuracies).reduce((a, b) => 
        (a[1].totalAcc / a[1].games > b[1].totalAcc / b[1].games) ? a : b
      , ['', { totalAcc: 0, games: 0 }]);
      return mostAccuratePlayer[1].games > 0 ? {
        playerName: mostAccuratePlayer[0],
        averageAccuracy: mostAccuratePlayer[1].totalAcc / mostAccuratePlayer[1].games,
        noOfMatches: mostAccuratePlayer[1].games
      } : null;
    },
    [INSIGHTS.HIGHEST_WINNING_STREAK]: (games) => {
      const playerStreaks = games.reduce((acc, game) => {
        ['white', 'black'].forEach(color => {
          const playerName = game.players[color].user.name;
          if (!acc[playerName]) acc[playerName] = [];
          acc[playerName].push(game.winner === color);
        });
        return acc;
      }, {});
      const highestStreak = Object.entries(playerStreaks).reduce((highest, [player, results]) => {
        const streak = highestConsecutiveCount(results, true);
        return streak > highest.streak ? { players: [player], streak } : 
               streak === highest.streak ? { players: [...highest.players, player], streak } : highest;
      }, { players: [], streak: 0 });
      return highestStreak.streak > 0 ? { playerNames: highestStreak.players, streakCount: highestStreak.streak } : null;
    }
  };

  insightsToCalculate.forEach(insight => {
    if (insightCalculations[insight]) {
      Object.assign(insights, calculateInsight(insight, tournamentGames, insightCalculations[insight]));
    }
  });

  analysedGames = tournamentGames.filter(game => game.analysis).length;

  return { ...insights, analysedGames, totalGames };
};

export default calculateAllInsights;
