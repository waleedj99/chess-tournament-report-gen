import { INSIGHTS } from './constants';

const calculatePGNInsights = (pgnGame) => {
  console.log("Calculating insights for PGN game:", pgnGame);
  
  const insights = {};
  let analysedGames = 0;
  let totalGames = 1; // Since we're processing a single game

  // Helper function to get move count
  const getMoveCount = (moves) => moves.length;

  // Helper function to get player names
  const getPlayerNames = () => ({
    white: pgnGame.tags.White,
    black: pgnGame.tags.Black
  });

  // Calculate move-based insights
  insights[INSIGHTS.SHORTEST_GAME_BY_MOVES] = [{
    gameId: "pgn-1",
    players: {
      white: { user: { name: pgnGame.tags.White } },
      black: { user: { name: pgnGame.tags.Black } }
    },
    value: getMoveCount(pgnGame.moves)
  }];

  insights[INSIGHTS.LONGEST_GAME_BY_MOVES] = [{
    gameId: "pgn-1",
    players: {
      white: { user: { name: pgnGame.tags.White } },
      black: { user: { name: pgnGame.tags.Black } }
    },
    value: getMoveCount(pgnGame.moves)
  }];

  // Calculate time-based insights
  const longestMove = pgnGame.moves.reduce((longest, move) => {
    const timeSpent = move.commentDiag?.clk ? 
      parseFloat(move.commentDiag.clk.split(':').reduce((acc, time) => acc * 60 + parseFloat(time), 0)) : 0;
    return timeSpent > longest.timeTaken ? 
      { moveNo: move.moveNumber, timeTaken: timeSpent, side: move.turn === 'w' ? 'white' : 'black' } : 
      longest;
  }, { moveNo: 0, timeTaken: 0, side: 'white' });

  insights[INSIGHTS.LONGEST_MOVE_BY_TIME] = [{
    gameId: "pgn-1",
    players: {
      white: { user: { name: pgnGame.tags.White } },
      black: { user: { name: pgnGame.tags.Black } }
    },
    ...longestMove
  }];

  // Opening information
  insights[INSIGHTS.MOST_USED_OPENING] = [{
    openingName: pgnGame.tags.Opening || "Unknown Opening",
    noOfTimes: 1
  }];

  // Calculate average moves
  insights[INSIGHTS.AVERAGE_MOVE_COUNT] = [{
    insightValue: getMoveCount(pgnGame.moves)
  }];

  analysedGames = 1;

  return { insights, analysedGames, totalGames };
};

export default calculatePGNInsights;