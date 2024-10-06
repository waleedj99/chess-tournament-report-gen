import { useState } from 'react';

export const useInsightSelection = () => {
  const [selectedInsights, setSelectedInsights] = useState({
    "MOST_ACCURATE_GAME": [0],
    'SHORTEST_GAME_LENGTH_BY_MOVES': [0],
    'LONGEST_GAME_LENGTH_BY_MOVES': [0],
    'LONGEST_MOVE_BY_TIME': [0],
    'MOST_DYNAMIC_GAME': [0],
    'MOST_USED_OPENING': [0],
    'MOST_ACCURATE_PLAYER': [0],
    'HIGHEST_WINNING_STREAK': [0]
  });

  const handleInsightSelection = (insightKey, itemIndex) => {
    setSelectedInsights(prev => ({
      ...prev,
      [insightKey]: prev[insightKey]?.includes(itemIndex)
        ? prev[insightKey].filter(i => i !== itemIndex)
        : [...(prev[insightKey] || []), itemIndex]
    }));
  };

  return { selectedInsights, handleInsightSelection };
};