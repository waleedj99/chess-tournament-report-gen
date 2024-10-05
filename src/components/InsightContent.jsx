import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ExternalLinkIcon, ChevronDownIcon, ChevronUpIcon } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';

const InsightContent = ({
  insightKey,
  value,
  isPngPreview,
  selectedItems,
  onItemSelection,
  showOnlySelected
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

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
          return (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-medium">{item.players?.white?.name || 'Unknown'} vs {item.players?.black?.name || 'Unknown'}</span>
                {renderGameRedirectButton(item.gameId)}
              </div>
              <div className="text-sm">
                <p>Average Accuracy: {item.value?.toFixed(2)}%</p>
                <p>White: {item.players?.white?.name || 'Unknown'} (Accuracy: {item.players?.white?.accuracy?.toFixed(2) || 'N/A'}%)</p>
                <p>Black: {item.players?.black?.name || 'Unknown'} (Accuracy: {item.players?.black?.accuracy?.toFixed(2) || 'N/A'}%)</p>
              </div>
            </div>
          );
        case 'SHORTEST_GAME_LENGTH_BY_MOVES':
        case 'LONGEST_GAME_LENGTH_BY_MOVES':
          return (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-medium">{item.players?.white?.user?.name || 'Unknown'} vs {item.players?.black?.user?.name || 'Unknown'}</span>
                {renderGameRedirectButton(item.gameId)}
              </div>
              <p className="text-sm">Game length: {item.value} moves</p>
            </div>
          );
        case 'LONGEST_MOVE_BY_TIME':
          return (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-medium">Move {item.moveNo || 'N/A'} by {item.side || 'N/A'}</span>
                {renderGameRedirectButton(item.gameId)}
              </div>
              <p className="text-sm">Time taken: {item.timeTaken?.toFixed(2) || 'N/A'} seconds</p>
            </div>
          );
        case 'MOST_DYNAMIC_GAME':
          return (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-medium">{item.players?.white?.user?.name || 'Unknown'} vs {item.players?.black?.user?.name || 'Unknown'}</span>
                {renderGameRedirectButton(item.gameId)}
              </div>
              <p className="text-sm">Turn arounds: {item.value}</p>
            </div>
          );
        case 'MOST_USED_OPENING':
          return (
            <div className="space-y-2">
              <p className="font-medium">{item.openingName || 'Unknown'}</p>
              <p className="text-sm">Used {item.noOfTimes || 'N/A'} times</p>
            </div>
          );
        case 'MOST_ACCURATE_PLAYER':
          return (
            <div className="space-y-2">
              <p className="font-medium">{item.playerName || 'Unknown'}</p>
              <p className="text-sm">Average Accuracy: {item.averageAccuracy?.toFixed(2) || 'N/A'}%</p>
              <p className="text-sm">Matches played: {item.noOfMatches || 'N/A'}</p>
            </div>
          );
        case 'HIGHEST_WINNING_STREAK':
          return (
            <div className="space-y-2">
              <p className="font-medium">{item.playerNames?.join(', ') || 'Unknown'}</p>
              <p className="text-sm">Winning streak: {item.streakCount || 'N/A'} games</p>
            </div>
          );
        default:
          return <span>{JSON.stringify(item)}</span>;
      }
    };

    return (
      <div key={index} className="mb-4 p-3 bg-gray-100 dark:bg-gray-800 rounded-lg">
        <div className="flex-grow">{renderContent()}</div>
        {!isPngPreview && !showOnlySelected && (
          <Checkbox
            checked={isSelected}
            onCheckedChange={toggleSelection}
            className="mt-2"
          />
        )}
      </div>
    );
  };

  const values = Array.isArray(value) ? value : [value];
  const valuesToShow = showOnlySelected ? values.filter((_, index) => selectedItems.includes(index)) : values;

  return (
    <div className="space-y-2">
      {valuesToShow.slice(0, isExpanded ? valuesToShow.length : 1).map((item, index) => formatSingleInsight(item, index))}
      {!isPngPreview && valuesToShow.length > 1 && (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsExpanded(!isExpanded)}
          className="mt-2 w-full"
        >
          {isExpanded ? (
            <>
              <ChevronUpIcon className="mr-2 h-4 w-4" />
              Show less
            </>
          ) : (
            <>
              <ChevronDownIcon className="mr-2 h-4 w-4" />
              Show {valuesToShow.length - 1} more
            </>
          )}
        </Button>
      )}
    </div>
  );
};

export default InsightContent;