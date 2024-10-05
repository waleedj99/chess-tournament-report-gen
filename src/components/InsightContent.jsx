import React from 'react';
import { Button } from '@/components/ui/button';
import { ExternalLinkIcon } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';

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

    const renderContent = () => {
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

    return (
      <div key={index} className="mb-4 p-3 bg-gray-100 dark:bg-gray-800 rounded-lg">
        <div className="flex items-center justify-between">
          <p className="flex-grow">{renderContent()}</p>
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
      ) : (
        formatSingleInsight(valuesToShow[0], 0)
      )}
    </div>
  );
};

export default InsightContent;