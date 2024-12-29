import { INSIGHTS } from './constants';

const calculatePGNInsights = (pgnGames) => {
  console.log("Calculating insights for PGN games:", pgnGames);
  
  const insights = {};
  let analysedGames = 0;
  let totalGames = pgnGames.length;

  // Helper function to get move count
  const getMoveCount = (moves) => moves.length;

  // Helper function to get player names
  const getPlayerNames = (game) => ({
    white: game.tags.White,
    black: game.tags.Black
  });

  // Process all games and aggregate data
  const gamesData = pgnGames.map(game => {
    const moveCount = getMoveCount(game.moves);
    const players = getPlayerNames(game);
    const longestMove = game.moves.reduce((longest, move) => {
      const timeSpent = move.commentDiag?.clk ? 
        parseFloat(move.commentDiag.clk.split(':').reduce((acc, time) => acc * 60 + parseFloat(time), 0)) : 0;
      return timeSpent > longest.timeTaken ? 
        { moveNo: move.moveNumber, timeTaken: timeSpent, side: move.turn === 'w' ? 'white' : 'black' } : 
        longest;
    }, { moveNo: 0, timeTaken: 0, side: 'white' });

    return {
      gameId: `pgn-${analysedGames++}`,
      players,
      moveCount,
      longestMove,
      opening: game.tags.Opening || "Unknown Opening"
    };
  });

  // Calculate aggregated insights
  insights[INSIGHTS.SHORTEST_GAME_BY_MOVES] = gamesData
    .sort((a, b) => a.moveCount - b.moveCount)
    .slice(0, 5)
    .map(game => ({
      gameId: game.gameId,
      players: {
        white: { user: { name: game.players.white } },
        black: { user: { name: game.players.black } }
      },
      value: game.moveCount
    }));

  insights[INSIGHTS.LONGEST_GAME_BY_MOVES] = gamesData
    .sort((a, b) => b.moveCount - a.moveCount)
    .slice(0, 5)
    .map(game => ({
      gameId: game.gameId,
      players: {
        white: { user: { name: game.players.white } },
        black: { user: { name: game.players.black } }
      },
      value: game.moveCount
    }));

  insights[INSIGHTS.LONGEST_MOVE_BY_TIME] = gamesData
    .sort((a, b) => b.longestMove.timeTaken - a.longestMove.timeTaken)
    .slice(0, 5)
    .map(game => ({
      gameId: game.gameId,
      players: {
        white: { user: { name: game.players.white } },
        black: { user: { name: game.players.black } }
      },
      ...game.longestMove
    }));

  // Opening statistics
  const openingStats = gamesData.reduce((stats, game) => {
    stats[game.opening] = (stats[game.opening] || 0) + 1;
    return stats;
  }, {});

  insights[INSIGHTS.MOST_USED_OPENING] = Object.entries(openingStats)
    .map(([opening, count]) => ({
      openingName: opening,
      noOfTimes: count
    }))
    .sort((a, b) => b.noOfTimes - a.noOfTimes)
    .slice(0, 5);

  // Average moves calculation
  const totalMoves = gamesData.reduce((sum, game) => sum + game.moveCount, 0);
  insights[INSIGHTS.AVERAGE_MOVE_COUNT] = [{
    insightValue: Math.round((totalMoves / totalGames) * 100) / 100
  }];

  return { insights, analysedGames, totalGames };
};

export default calculatePGNInsights;