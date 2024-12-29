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

const calculateMoveCount = (moves) => {
  return moves ? Math.floor(moves.split(' ').length / 2) : 0;
};

const calculatePlayerAverageGames = (games) => {
  const playerGames = new Map();
  
  games.forEach(game => {
    ['white', 'black'].forEach(color => {
      const player = game.players[color]?.user?.name;
      if (player && game.moves) {
        if (!playerGames.has(player)) {
          playerGames.set(player, { totalMoves: 0, games: 0 });
        }
        const moveCount = calculateMoveCount(game.moves);
        const playerData = playerGames.get(player);
        playerData.totalMoves += moveCount;
        if(moveCount > 2) {
          playerData.games += 1;
        }
       
      }
    });
  });

  return Array.from(playerGames.entries())
    .map(([player, data]) => ({
      player,
      averageMoves: data.totalMoves / data.games
    }));
};

const countTerminationMethods = (games) => {
  const playerStats = new Map();

  games.forEach(game => {
    const winner = game.winner;
    const loser = winner === 'white' ? 'black' : 'white';
    const winnerName = game.players[winner]?.user?.name;
    const loserName = game.players[loser]?.user?.name;
    const status = game.status;

    if (winnerName) {
      if (!playerStats.has(winnerName)) {
        playerStats.set(winnerName, { checkmateWins: 0, timeoutWins: 0, checkmateLosses: 0, timeoutLosses: 0 });
      }
      if (status === 'mate') playerStats.get(winnerName).checkmateWins++;
      if (status === 'outoftime') playerStats.get(winnerName).timeoutWins++;
    }

    if (loserName) {
      if (!playerStats.has(loserName)) {
        playerStats.set(loserName, { checkmateWins: 0, timeoutWins: 0, checkmateLosses: 0, timeoutLosses: 0 });
      }
      if (status === 'mate') playerStats.get(loserName).checkmateLosses++;
      if (status === 'outoftime') playerStats.get(loserName).timeoutLosses++;
    }
  });

  return playerStats;
};

const calculateGameTerminations = (games) => {
  const terminationStats = {
    mate: 0,
    resign: 0,
    outoftime: 0,
    draw: 0,
    stalemate: 0,
    other: 0
  };

  games.forEach(game => {
    const status = game.status;
    if (status in terminationStats) {
      terminationStats[status]++;
    } else {
      terminationStats.other++;
    }
  });

  return Object.entries(terminationStats)
    .map(([type, count]) => ({
      terminationType: type,
      count: count,
      percentage: (count / games.length * 100).toFixed(1)
    }))
    .sort((a, b) => b.count - a.count);
};

const calculateInsight = (insightName, games, calculationFunction) => {
  const result = calculationFunction(games);
  return result ? { [insightName]: result } : {};
};

const calculateAllInsights = (tournamentGames, insightsToCalculate, onProgress) => {
 
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
        .filter(game => game.players.white && game.players.black && 
                        typeof game.players.white?.analysis?.accuracy === 'number' && 
                        typeof game.players.black?.analysis?.accuracy === 'number')
        .map(game => ({
          gameId: game.id,
          players: {
            white: {
              name: game.players.white.user.name,
              accuracy: game.players.white?.analysis?.accuracy
            },
            black: {
              name: game.players.black.user.name,
              accuracy: game.players.black?.analysis?.accuracy
            }
          },
          value: (game.players.white?.analysis?.accuracy + game.players.black?.analysis?.accuracy) / 2
        }))
        .sort((a, b) => b.value - a.value)
        .slice(0, 5);
    },
    [INSIGHTS.MOST_DYNAMIC_GAME]: (games) => {
      return games
        .filter(game => game.analysis)
        .map(game => {
          let turnArounds = 0;
          let prevWinning = null;
          game.analysis.forEach(analysis => {
            const whiteWinning = 'eval' in analysis ? analysis.eval > 0 : analysis.mate > 0;
            if (whiteWinning !== prevWinning && prevWinning !== null) turnArounds++;
            prevWinning = whiteWinning;
          });
          return { gameId: game.id, players: game.players, value: turnArounds };
        })
        .sort((a, b) => b.value - a.value)
        .slice(0, 5);
    },
    [INSIGHTS.MOST_USED_OPENING_MOVE_WHITE]: (games) => {
      const openings = new Map();
      games.forEach(game => {
        if (game.opening) {
          const key = `${game.opening.name}`;
          openings.set(key, (openings.get(key) || 0) + 1);
        }
      });
      return Array.from(openings.entries())
        .map(([opening, count]) => ({ opening, moveNumber: count }))
        .sort((a, b) => b.moveNumber - a.moveNumber)
        .slice(0, 5);
    },
    [INSIGHTS.MOST_USED_OPENING_MOVE_BLACK]: (games) => {
      const openings = new Map();
      games.forEach(game => {
        if (game.opening) {
          const key = `${game.opening.name}`;
          openings.set(key, (openings.get(key) || 0) + 1);
        }
      });
      return Array.from(openings.entries())
        .map(([opening, count]) => ({ opening, moveNumber: count }))
        .sort((a, b) => b.moveNumber - a.moveNumber)
        .slice(0, 5);
    },
    [INSIGHTS.PLAYER_WITH_HIGHEST_MOVE_AVERAGE]: (games) => {
      return calculatePlayerAverageGames(games)
        .sort((a, b) => b.averageMoves - a.averageMoves)
        .slice(0, 5)
        .map(({ player, averageMoves }) => ({
          player,
          insightValue: Math.round(averageMoves * 100) / 100
        }));
    },
    [INSIGHTS.PLAYER_WITH_LOWEST_MOVE_AVERAGE]: (games) => {
      return calculatePlayerAverageGames(games)
        .sort((a, b) => a.averageMoves - b.averageMoves)
        .slice(0, 5)
        .map(({ player, averageMoves }) => ({
          player,
          insightValue: Math.round(averageMoves * 100) / 100
        }));
    },
    [INSIGHTS.AVERAGE_MOVE_COUNT]: (games) => {
      const totalMoves = games.reduce((acc, game) => acc + calculateMoveCount(game.moves), 0);
      return [{
        insightValue: Math.round((totalMoves / games.length) * 100) / 100
      }];
    },
    [INSIGHTS.PLAYER_WITH_MOST_CHECKMATES_WIN]: (games) => {
      const stats = countTerminationMethods(games);
      return Array.from(stats.entries())
        .map(([player, data]) => ({ player, number: data.checkmateWins }))
        .sort((a, b) => b.number - a.number)
        .slice(0, 5);
    },
    [INSIGHTS.PLAYER_WITH_MOST_TIMEOUT_WIN]: (games) => {
      const stats = countTerminationMethods(games);
      return Array.from(stats.entries())
        .map(([player, data]) => ({ player, number: data.timeoutWins }))
        .sort((a, b) => b.number - a.number)
        .slice(0, 5);
    },
    [INSIGHTS.PLAYER_WITH_MOST_CHECKMATES_LOSS]: (games) => {
      const stats = countTerminationMethods(games);
      return Array.from(stats.entries())
        .map(([player, data]) => ({ player, number: data.checkmateLosses }))
        .sort((a, b) => b.number - a.number)
        .slice(0, 5);
    },
    [INSIGHTS.PLAYER_WITH_MOST_TIMEOUT_LOSS]: (games) => {
      const stats = countTerminationMethods(games);
      return Array.from(stats.entries())
        .map(([player, data]) => ({ player, number: data.timeoutLosses }))
        .sort((a, b) => b.number - a.number)
        .slice(0, 5);
    },
    [INSIGHTS.GAME_TERMINATIONS]: (games) => {
      return calculateGameTerminations(games);
    },
  };

  insightsToCalculate.forEach(insight => {
    if (insightCalculations[insight]) {
      const result = calculateInsight(insight, tournamentGames, insightCalculations[insight]);
      if (Object.keys(result).length > 0) {
        insights[insight] = result[insight];
      }
    }
  });

  analysedGames = tournamentGames.filter(game => game.analysis).length;

  return { insights, analysedGames, totalGames };
};

export default calculateAllInsights;
