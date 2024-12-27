import React from 'react';
import { Button } from '@/components/ui/button';
import { ExternalLinkIcon } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import { INSIGHTS, INSIGHT_SENTENCE } from '@/utils/constants';

const InsightContent = ({
  insightKey,
  value,
  isPngPreview,
  selectedItems,
  onItemSelection,
  showOnlySelected,
  isExpanded
}) => {
  const renderGameRedirectButton = (gameId) => {
    return (
      <Button
        variant="ghost"
        size="sm"
        className="ml-auto"
        onClick={() => window.open(`https://lichess.org/${gameId}`, '_blank')}
      >
        Open <ExternalLinkIcon className="ml-1 h-4 w-4" />
      </Button>
    );
  };

  const formatSingleInsight = (item, index) => {
    if (!item) return null;

    const isSelected = selectedItems.includes(index);

    const toggleSelection = () => {
      onItemSelection(insightKey, index);
    };

    const formatPlayerName = (name) => `<span class="text-orange-300 text-xl font-bold">${name || 'Unknown'}</span>`;
    const formatValue = (value) => `<span class="text-orange-300 text-xl font-bold">${value}</span>`;

    const renderContent = () => {
      switch (insightKey) {
        case INSIGHTS.MOST_ACCURATE_GAME:
          return (
            <span dangerouslySetInnerHTML={{ 
              __html: `${formatPlayerName(item.players?.white?.name)} vs ${formatPlayerName(item.players?.black?.name)} had an average accuracy of ${formatValue(item.value?.toFixed(2))}%.`
            }} />
          );
        case INSIGHTS.SHORTEST_GAME_BY_MOVES:
        case INSIGHTS.LONGEST_GAME_BY_MOVES:
          return (
            <span dangerouslySetInnerHTML={{ 
              __html: `${formatPlayerName(item.players?.white?.user?.name)} vs ${formatPlayerName(item.players?.black?.user?.name)} played a game lasting ${formatValue(item.value)} moves.`
            }} />
          );
        case INSIGHTS.LONGEST_MOVE_BY_TIME:
          return (
            <span dangerouslySetInnerHTML={{ 
              __html: `Move ${formatValue(item.moveNo || 'N/A')} by ${formatPlayerName(item.side || 'N/A')} took ${formatValue(item.timeTaken?.toFixed(2) || 'N/A')} seconds.`
            }} />
          );
        case INSIGHTS.MOST_DYNAMIC_GAME:
          return (
            <span dangerouslySetInnerHTML={{ 
              __html: `${formatPlayerName(item.players?.white?.user?.name)} vs ${formatPlayerName(item.players?.black?.user?.name)} had ${formatValue(item.value)} turn arounds.`
            }} />
          );
        case INSIGHTS.MOST_USED_OPENING:
          return (
            <span dangerouslySetInnerHTML={{ 
              __html: `${formatValue(item.openingName || 'Unknown')} was used ${formatValue(item.noOfTimes || 'N/A')} times.`
            }} />
          );
        case INSIGHTS.MOST_ACCURATE_PLAYER:
          return (
            <span dangerouslySetInnerHTML={{ 
              __html: `${formatPlayerName(item.playerName || 'Unknown')} had an average accuracy of ${formatValue(item.averageAccuracy?.toFixed(2) || 'N/A')}% over ${formatValue(item.noOfMatches || 'N/A')} matches.`
            }} />
          );
        case INSIGHTS.HIGHEST_WINNING_STREAK:
          return (
            <span dangerouslySetInnerHTML={{ 
              __html: `${formatPlayerName(item.playerNames?.join(', ') || 'Unknown')} had a winning streak of ${formatValue(item.streakCount || 'N/A')} games.`
            }} />
          );
        default:
          return JSON.stringify(item);
      }
    };

    return (
      <div key={index} className="mb-4 p-6 bg-gray-900 dark:bg-gray-800 rounded-lg">
        <div className="flex items-center justify-between">
          <p className="flex-grow text-xl text-white">{renderContent()}</p>
          {!isPngPreview && !showOnlySelected && (
            <Checkbox
              checked={isSelected}
              onCheckedChange={toggleSelection}
              className="ml-2"
            />
          )}
        </div>
        {item.gameId && renderGameRedirectButton(item.gameId)}
      </div>
    );
  };

  const values = Array.isArray(value) ? value : [value];
  const valuesToShow = showOnlySelected ? values.filter((_, index) => selectedItems.includes(index)) : values;

  return (
    <div className="space-y-2">
      {isExpanded ? (
        valuesToShow.map((item, index) => formatSingleInsight(item, index))
      ) : <></>}
    </div>
  );
};

export default InsightContent;