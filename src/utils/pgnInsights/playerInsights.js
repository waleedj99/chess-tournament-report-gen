export const calculatePlayerInsights = (games) => {
  const playerStats = new Map();
  const playerMoves = new Map();
  
  // Calculate player statistics
  games.forEach(game => {
    const whitePlayer = game.tags.White;
    const blackPlayer = game.tags.Black;
    const gameResult = game.tags.Result;
    const moveCount = game.moves.length;
    
    // Track moves per player
    [whitePlayer, blackPlayer].forEach(player => {
      if (!playerMoves.has(player)) {
        playerMoves.set(player, { totalMoves: 0, games: 0 });
      }
      const stats = playerMoves.get(player);
      stats.totalMoves += moveCount;
      stats.games += 1;
    });

    // Track wins/losses
    if (!playerStats.has(whitePlayer)) {
      playerStats.set(whitePlayer, { wins: 0, losses: 0, streak: 0, maxStreak: 0 });
    }
    if (!playerStats.has(blackPlayer)) {
      playerStats.set(blackPlayer, { wins: 0, losses: 0, streak: 0, maxStreak: 0 });
    }

    // Update stats based on game result
    if (gameResult === '1-0') {
      playerStats.get(whitePlayer).wins++;
      playerStats.get(blackPlayer).losses++;
    } else if (gameResult === '0-1') {
      playerStats.get(blackPlayer).wins++;
      playerStats.get(whitePlayer).losses++;
    }
  });

  // Calculate move averages
  const moveAverages = Array.from(playerMoves.entries())
    .map(([player, stats]) => ({
      player,
      averageMoves: stats.totalMoves / stats.games
    }))
    .sort((a, b) => b.averageMoves - a.averageMoves);

  return {
    PLAYER_WITH_HIGHEST_MOVE_AVERAGE: moveAverages.slice(0, 5).map(stat => ({
      player: stat.player,
      insightValue: Math.round(stat.averageMoves * 100) / 100
    })),
    PLAYER_WITH_LOWEST_MOVE_AVERAGE: moveAverages.reverse().slice(0, 5).map(stat => ({
      player: stat.player,
      insightValue: Math.round(stat.averageMoves * 100) / 100
    }))
  };
};