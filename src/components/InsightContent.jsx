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
        case 'SHORTEST_GAME_LENGTH_BY_MOVES':
        case 'LONGEST_GAME_LENGTH_BY_MOVES':
          return (
            <div className="flex items-center justify-between">
              <span>{item.players?.white?.user?.name || 'Unknown'} vs {item.players?.black?.user?.name || 'Unknown'} ({item.value} moves)</span>
              {renderGameRedirectButton(item.gameId)}
            </div>
          );
        case 'LONGEST_MOVE_BY_TIME':
          return (
            <div className="flex items-center justify-between">
              <span>Move {item.moveNo || 'N/A'} by {item.side || 'N/A'} ({item.timeTaken?.toFixed(2) || 'N/A'} seconds)</span>
              {renderGameRedirectButton(item.gameId)}
            </div>
          );
        case 'MOST_ACCURATE_GAME':
          return (
            <div className="flex items-center justify-between">
              <span>
                White: {item.players?.white?.name || 'Unknown'} ({item.players?.white?.accuracy?.toFixed(2) || 'N/A'}%) 
                Black: {item.players?.black?.name || 'Unknown'} ({item.players?.black?.accuracy?.toFixed(2) || 'N/A'}%)
              </span>
              {renderGameRedirectButton(item.gameId)}
            </div>
          );
        case 'MOST_DYNAMIC_GAME':
          return (
            <div className="flex items-center justify-between">
              <span>{item.players?.white?.user?.name || 'Unknown'} vs {item.players?.black?.user?.name || 'Unknown'} ({item.value} turn arounds)</span>
              {renderGameRedirectButton(item.gameId)}
            </div>
          );
        case 'MOST_USED_OPENING':
          return (
            <div className="flex items-center justify-between">
              <span>{item.openingName || 'Unknown'} (Used {item.noOfTimes || 'N/A'} times)</span>
            </div>
          );
        case 'MOST_ACCURATE_PLAYER':
          return (
            <div className="flex items-center justify-between">
              <span>{item.playerName || 'Unknown'} ({item.averageAccuracy?.toFixed(2) || 'N/A'}% in {item.noOfMatches || 'N/A'} matches)</span>
            </div>
          );
        case 'HIGHEST_WINNING_STREAK':
          return (
            <div className="flex items-center justify-between">
              <span>{item.playerNames?.join(', ') || 'Unknown'} ({item.streakCount || 'N/A'} games)</span>
            </div>
          );
        default:
          return <span>{JSON.stringify(item)}</span>;
      }
    };

    return (
      <div key={index} className="mb-2 flex items-center justify-between">
        <div className="flex-grow">{renderContent()}</div>
        {!isPngPreview && !showOnlySelected && (
          <Checkbox
            checked={isSelected}
            onCheckedChange={toggleSelection}
            className="ml-2"
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