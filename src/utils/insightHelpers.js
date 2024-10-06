export const toTitleCase = (str) => {
  return str.split('_').map(word => 
    word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
  ).join(" ");
};

export const getInsightDescription = (insightKey, item) => {
  switch (insightKey) {
    case 'MOST_ACCURATE_GAME':
      return `${item.players?.white?.name || 'Unknown'} vs ${item.players?.black?.name || 'Unknown'} had an average accuracy of ${item.value?.toFixed(2)}%.`;
    case 'SHORTEST_GAME_LENGTH_BY_MOVES':
    case 'LONGEST_GAME_LENGTH_BY_MOVES':
      return `${item.players?.white?.user?.name || 'Unknown'} vs ${item.players?.black?.user?.name || 'Unknown'} played a game lasting ${item.value} moves.`;
    case 'LONGEST_MOVE_BY_TIME':
      return `Move ${item.moveNo || 'N/A'} by ${item.side || 'N/A'} took ${item.timeTaken?.toFixed(2) || 'N/A'} seconds.`;
    case 'MOST_DYNAMIC_GAME':
      return `${item.players?.white?.user?.name || 'Unknown'} vs ${item.players?.black?.user?.name || 'Unknown'} had ${item.value} turn arounds.`;
    case 'MOST_USED_OPENING':
      return `${item.openingName || 'Unknown'} was used ${item.noOfTimes || 'N/A'} times.`;
    case 'MOST_ACCURATE_PLAYER':
      return `${item.playerName || 'Unknown'} had an average accuracy of ${item.averageAccuracy?.toFixed(2) || 'N/A'}% over ${item.noOfMatches || 'N/A'} matches.`;
    case 'HIGHEST_WINNING_STREAK':
      return `${item.playerNames?.join(', ') || 'Unknown'} had a winning streak of ${item.streakCount || 'N/A'} games.`;
    default:
      return JSON.stringify(item);
  }
};

export const getInsightTooltip = (key) => {
  switch(key) {
    case 'MOST_ACCURATE_GAME':
      return "Calculated based on the average accuracy of both players in a game.";
    case 'SHORTEST_GAME_LENGTH_BY_MOVES':
      return "Determined by the game with the least number of moves.";
    case 'LONGEST_GAME_LENGTH_BY_MOVES':
      return "Determined by the game with the most number of moves.";
    case 'LONGEST_MOVE_BY_TIME':
      return "Calculated by finding the move that took the most time across all games.";
    case 'MOST_DYNAMIC_GAME':
      return "Based on the number of times the advantage switched between players.";
    default:
      return "Insight calculation method.";
  }
};

export const getInsightIcon = (key) => {
  return '🏆';
};