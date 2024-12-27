import React from 'react';
import { INSIGHTS } from '@/utils/constants';

const formatPlayerName = (name) => `<span class="text-orange-300 text-xl font-bold">${name || 'Unknown'}</span>`;
const formatValue = (value) => `<span class="text-orange-300 text-xl font-bold">${value}</span>`;

const InsightFormatter = ({ insightKey, item }) => {
  const renderContent = () => {
    switch (insightKey) {
      case INSIGHTS.MOST_ACCURATE_GAME:
        return `${formatPlayerName(item.players?.white?.name)} vs ${formatPlayerName(item.players?.black?.name)} had an average accuracy of ${formatValue(item.value?.toFixed(2))}%.`;
      case INSIGHTS.SHORTEST_GAME_BY_MOVES:
      case INSIGHTS.LONGEST_GAME_BY_MOVES:
        return `${formatPlayerName(item.players?.white?.user?.name)} vs ${formatPlayerName(item.players?.black?.user?.name)} played a game lasting ${formatValue(item.value)} moves.`;
      case INSIGHTS.LONGEST_MOVE_BY_TIME:
        return `Move ${formatValue(item.moveNo || 'N/A')} by ${formatPlayerName(item.side || 'N/A')} took ${formatValue(item.timeTaken?.toFixed(2) || 'N/A')} seconds.`;
      case INSIGHTS.MOST_DYNAMIC_GAME:
        return `${formatPlayerName(item.players?.white?.user?.name)} vs ${formatPlayerName(item.players?.black?.user?.name)} had ${formatValue(item.value)} turn arounds.`;
      case INSIGHTS.MOST_USED_OPENING:
        return `${formatValue(item.openingName || 'Unknown')} was used ${formatValue(item.noOfTimes || 'N/A')} times.`;
      case INSIGHTS.MOST_ACCURATE_PLAYER:
        return `${formatPlayerName(item.playerName || 'Unknown')} had an average accuracy of ${formatValue(item.averageAccuracy?.toFixed(2) || 'N/A')}% over ${formatValue(item.noOfMatches || 'N/A')} matches.`;
      case INSIGHTS.HIGHEST_WINNING_STREAK:
        return `${formatPlayerName(item.playerNames?.join(', ') || 'Unknown')} had a winning streak of ${formatValue(item.streakCount || 'N/A')} games.`;
      default:
        return JSON.stringify(item);
    }
  };

  return (
    <span dangerouslySetInnerHTML={{ __html: renderContent() }} />
  );
};

export default InsightFormatter;