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

const calculateAllInsights = (tournamentGames, insightsToCalculate) => {
  const insights = {};
  let analysedGames = 0;
  let totalGames = tournamentGames.length;

  const insightCalculations = {
    [INSIGHTS.SHORTEST_GAME_BY_MOVES]: (games) => {
      return games
        .map(game => ({
          id: game.id,
          players: game.players,
          moves: game.moves ? Math.floor(game.moves.split(' ').length / 2) : Infinity
        }))
        .filter(game => game.moves > 2)
        .sort((a, b) => a.moves - b.moves)
        .slice(0, 5)
        .map(game => ({ gameId: game.id, players: game.players, value: game.moves }));
    },
    [INSIGHTS.LONGEST_GAME_BY_MOVES]: (games) => {
      return games
        .map(game => ({
          id: game.id,
          players: game.players,
          moves: game.moves ? Math.floor(game.moves.split(' ').length / 2) : 0
        }))
        .sort((a, b) => b.moves - a.moves)
        .slice(0, 5)
        .map(game => ({ gameId: game.id, players: game.players, value: game.moves }));
    },
    [INSIGHTS.LONGEST_MOVE_BY_TIME]: (games) => {
      return games
        .flatMap(game => {
          if (!game.clocks) return [];
          const [diffW, positionsW] = maxConsecutiveDifferenceWithPositions(game.clocks.filter((_, i) => i % 2 === 0));
          const [diffB, positionsB] = maxConsecutiveDifferenceWithPositions(game.clocks.filter((_, i) => i % 2 !== 0));
          return [
            { gameId: game.id, players: game.players, side: "white", timeTaken: diffW / 1000, moveNo: positionsW },
            { gameId: game.id, players: game.players, side: "black", timeTaken: diffB / 1000, moveNo: positionsB }
          ];
        })
        .sort((a, b) => b.timeTaken - a.timeTaken)
        .slice(0, 5);
    },

    [INSIGHTS.MOST_ACCURATE_GAME]: (games) => {
      return games
        .filter(game => 
          game.players.white && game.players.black && 
          typeof game.players.white.accuracy === 'number' && 
          typeof game.players.black.accuracy === 'number'
        )
        .map(game => ({
          gameId: game.id,
          players: {
            white: {
              name: game.players.white.user.name,
              accuracy: game.players.white.accuracy
            },
            black: {
              name: game.players.black.user.name,
              accuracy: game.players.black.accuracy
            }
          },
          value: (game.players.white.accuracy + game.players.black.accuracy) / 2
        }))
        .sort((a, b) => b.value - a.value)
        .slice(0, 5);
    },

    [INSIGHTS.MOST_ACCURATE_PLAYER]: (games) => {
      const playerAccuracies = games.reduce((acc, game) => {
        ['white', 'black'].forEach(color => {
          if (game.players[color] && typeof game.players[color].accuracy === 'number') {
            const playerName = game.players[color].user.name;
            if (!acc[playerName]) acc[playerName] = { totalAcc: 0, games: 0 };
            acc[playerName].totalAcc += game.players[color].accuracy;
            acc[playerName].games++;
          }
        });
        return acc;
      }, {});

      return Object.entries(playerAccuracies)
        .map(([playerName, data]) => ({
          playerName,
          averageAccuracy: data.totalAcc / data.games,
          noOfMatches: data.games
        }))
        .sort((a, b) => b.averageAccuracy - a.averageAccuracy)
        .slice(0, 5);
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
      return Object.entries(playerStreaks)
        .map(([player, results]) => ({
          playerNames: [player],
          streakCount: highestConsecutiveCount(results, true)
        }))
        .sort((a, b) => b.streakCount - a.streakCount)
        .slice(0, 5);
    }
  };

  insightsToCalculate.forEach(insight => {
    if (insightCalculations[insight]) {
      const result = insightCalculations[insight](tournamentGames);
      if (result && result.length > 0) {
        insights[insight] = result;
      }
    }
  });

  analysedGames = tournamentGames.filter(game => game.analysis).length;

  return { insights, analysedGames, totalGames };
};

export default calculateAllInsights;
