export const calculateGameTerminationInsights = (games) => {
  const terminationStats = {
    mate: 0,
    resign: 0,
    outoftime: 0,
    draw: 0,
    stalemate: 0,
    other: 0
  };

  const playerStats = new Map();

  games.forEach(game => {
    const result = game.tags.Result;
    const white = game.tags.White;
    const black = game.tags.Black;
    
    if (!playerStats.has(white)) {
      playerStats.set(white, { checkmateWins: 0, timeoutWins: 0, checkmateLosses: 0, timeoutLosses: 0 });
    }
    if (!playerStats.has(black)) {
      playerStats.set(black, { checkmateWins: 0, timeoutWins: 0, checkmateLosses: 0, timeoutLosses: 0 });
    }

    // Update termination stats
    const status = determineGameStatus(result);
    terminationStats[status]++;

    // Update player stats based on game result
    updatePlayerStats(playerStats, white, black, result, status);
  });

  return {
    GAME_TERMINATIONS: Object.entries(terminationStats)
      .map(([type, count]) => ({
        terminationType: type,
        count,
        percentage: (count / games.length * 100).toFixed(1)
      }))
      .sort((a, b) => b.count - a.count),

    PLAYER_WITH_MOST_CHECKMATES_WIN: getTopPlayers(playerStats, 'checkmateWins'),
    PLAYER_WITH_MOST_CHECKMATES_LOSS: getTopPlayers(playerStats, 'checkmateLosses'),
    PLAYER_WITH_MOST_TIMEOUT_WIN: getTopPlayers(playerStats, 'timeoutWins'),
    PLAYER_WITH_MOST_TIMEOUT_LOSS: getTopPlayers(playerStats, 'timeoutLosses')
  };
};

const determineGameStatus = (result) => {
  switch (result) {
    case '1-0':
    case '0-1':
      return 'mate';
    case '1/2-1/2':
      return 'draw';
    default:
      return 'other';
  }
};

const updatePlayerStats = (playerStats, white, black, result, status) => {
  if (result === '1-0') {
    if (status === 'mate') {
      playerStats.get(white).checkmateWins++;
      playerStats.get(black).checkmateLosses++;
    } else if (status === 'outoftime') {
      playerStats.get(white).timeoutWins++;
      playerStats.get(black).timeoutLosses++;
    }
  } else if (result === '0-1') {
    if (status === 'mate') {
      playerStats.get(black).checkmateWins++;
      playerStats.get(white).checkmateLosses++;
    } else if (status === 'outoftime') {
      playerStats.get(black).timeoutWins++;
      playerStats.get(white).timeoutLosses++;
    }
  }
};

const getTopPlayers = (playerStats, stat) => {
  return Array.from(playerStats.entries())
    .map(([player, stats]) => ({
      player,
      number: stats[stat]
    }))
    .sort((a, b) => b.number - a.number)
    .slice(0, 5);
};