export const calculateOpeningInsights = (games) => {
  const openingStats = new Map();
  const whiteOpenings = new Map();
  const blackOpenings = new Map();

  games.forEach(game => {
    const opening = game.tags.Opening || 'Unknown Opening';
    
    // Track all openings
    openingStats.set(opening, (openingStats.get(opening) || 0) + 1);
    
    // Track openings by color
    if (game.moves[0]) {
      const firstMove = game.moves[0].notation.notation;
      whiteOpenings.set(firstMove, (whiteOpenings.get(firstMove) || 0) + 1);
    }
    if (game.moves[1]) {
      const firstBlackMove = game.moves[1].notation.notation;
      blackOpenings.set(firstBlackMove, (blackOpenings.get(firstBlackMove) || 0) + 1);
    }
  });

  return {
    MOST_USED_OPENING: Array.from(openingStats.entries())
      .map(([opening, count]) => ({
        openingName: opening,
        noOfTimes: count
      }))
      .sort((a, b) => b.noOfTimes - a.noOfTimes)
      .slice(0, 5),

    MOST_USED_OPENING_MOVE_WHITE: Array.from(whiteOpenings.entries())
      .map(([opening, moveNumber]) => ({ opening, moveNumber }))
      .sort((a, b) => b.moveNumber - a.moveNumber)
      .slice(0, 5),

    MOST_USED_OPENING_MOVE_BLACK: Array.from(blackOpenings.entries())
      .map(([opening, moveNumber]) => ({ opening, moveNumber }))
      .sort((a, b) => b.moveNumber - a.moveNumber)
      .slice(0, 5)
  };
};