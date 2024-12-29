import { calculateMoveCount } from './utils';

export const calculateMoveInsights = (games) => {
  const moveInsights = {};
  
  // Shortest and longest games
  const sortedByMoves = games
    .map(game => ({
      gameId: game.tags.Annotator?.split('/')?.pop() || null,
      players: {
        white: { user: { name: game.tags.White } },
        black: { user: { name: game.tags.Black } }
      },
      value: game.moves.length
    }))
    .sort((a, b) => a.value - b.value);

  moveInsights.SHORTEST_GAME_BY_MOVES = sortedByMoves.slice(0, 5);
  moveInsights.LONGEST_GAME_BY_MOVES = sortedByMoves.reverse().slice(0, 5);

  // Average move count
  const totalMoves = games.reduce((sum, game) => sum + game.moves.length, 0);
  moveInsights.AVERAGE_MOVE_COUNT = [{
    insightValue: Math.round((totalMoves / games.length) * 100) / 100
  }];

  // Longest move by time
  moveInsights.LONGEST_MOVE_BY_TIME = games
    .flatMap(game => {
      const moves = game.moves.map(move => ({
        gameId: game.tags.Annotator?.split('/')?.pop() || null,
        players: {
          white: { user: { name: game.tags.White } },
          black: { user: { name: game.tags.Black } }
        },
        moveNo: move.moveNumber,
        side: move.turn === 'w' ? 'white' : 'black',
        timeTaken: move.commentDiag?.clk ? parseFloat(move.commentDiag.clk.split(':').reduce((acc, time) => acc * 60 + parseFloat(time), 0)) : 0
      }));
      return moves;
    })
    .sort((a, b) => b.timeTaken - a.timeTaken)
    .slice(0, 5);

  return moveInsights;
};