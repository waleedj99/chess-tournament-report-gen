import React from 'react';
import { INSIGHTS } from '@/utils/constants';


const formatPlayerName = (name) => `<span class="text-orange-300 font-bold items-center">${name || 'Unknown'}</span>`;
const formatValue = (value) => `<span class="text-orange-300 font-bold items-center">${value}</span>`;
const formatBigValue = (value) => `<span class="text-orange-300 font-bold text-5xl items-center">${value}</span>`;

const formatTerminationType = (type) => {
  const typeMap = {
    mate: 'Checkmate',
    resign: 'Resignation',
    outoftime: 'Timeout',
    draw: 'Draw',
    stalemate: 'Stalemate',
    other: 'Other'
  };
  return typeMap[type] || type;
};

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
      case INSIGHTS.MOST_USED_OPENING_MOVE_WHITE:
      case INSIGHTS.MOST_USED_OPENING_MOVE_BLACK:
        return `${formatValue(item.opening)} was used ${formatValue(item.moveNumber)} times`;
      case INSIGHTS.PLAYER_WITH_HIGHEST_MOVE_AVERAGE:
      case INSIGHTS.PLAYER_WITH_LOWEST_MOVE_AVERAGE:
        return `${formatPlayerName(item.player)} played with an average of ${formatValue(item.insightValue)} moves`;
      case INSIGHTS.AVERAGE_MOVE_COUNT:
        return `${formatBigValue(item.insightValue)}`;
      case INSIGHTS.PLAYER_WITH_MOST_CHECKMATES_WIN:
        return `${formatPlayerName(item.player)} won ${formatValue(item.number)} matches with checkmate`;
      case INSIGHTS.PLAYER_WITH_MOST_TIMEOUT_WIN:
        return `${formatPlayerName(item.player)} won ${formatValue(item.number)} matches by timeout`;
      case INSIGHTS.PLAYER_WITH_MOST_CHECKMATES_LOSS:
        return `${formatPlayerName(item.player)} lost ${formatValue(item.number)} matches by checkmate`;
      case INSIGHTS.PLAYER_WITH_MOST_TIMEOUT_LOSS:
        return `${formatPlayerName(item.player)} lost ${formatValue(item.number)} matches by timeout`;
      case INSIGHTS.GAME_TERMINATIONS:
        return `${formatValue(item.count)} games (${item.percentage}%) ended by ${formatValue(formatTerminationType(item.terminationType))}`;
      default:
        return JSON.stringify(item);
    }
  };

  return (
    <span dangerouslySetInnerHTML={{ __html: renderContent() }} />
  );
};

export default InsightFormatter;