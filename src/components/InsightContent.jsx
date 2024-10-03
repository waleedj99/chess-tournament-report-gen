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
        className="ml-2"
        onClick={() => window.open(`https://lichess.org/${gameId}`, '_blank')}
      >
        <ExternalLinkIcon className="h-4 w-4" />
      </Button>
    );
  };

  const renderPlayerRedirectButton = (playerName) => {
    return (
      <Button
        variant="ghost"
        size="sm"
        className="ml-2"
        onClick={() => window.open(`https://lichess.org/@/${playerName}`, '_blank')}
      >
        <ExternalLinkIcon className="h-4 w-4" />
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
            <div>
              <p>Moves: {item.value}</p>
              <p>
                Players: {item.players?.white?.user?.name || 'Unknown'} vs {item.players?.black?.user?.name || 'Unknown'}
              </p>
            </div>
          );
        case 'LONGEST_MOVE_BY_TIME':
          return (
            <div>
              <p>Time taken: {item.timeTaken?.toFixed(2) || 'N/A'} seconds</p>
              <p>Move number: {item.moveNo || 'N/A'}</p>
              <p>Side: {item.side || 'N/A'}</p>
            </div>
          );
        case 'MOST_ACCURATE_GAME':
          return (
            <div>
              <p>Average Accuracy: {item.value?.toFixed(2) || 'N/A'}%</p>
              <p>White: {item.players?.white?.name || 'Unknown'} (Accuracy: {item.players?.white?.accuracy?.toFixed(2) || 'N/A'}%)</p>
              <p>Black: {item.players?.black?.name || 'Unknown'} (Accuracy: {item.players?.black?.accuracy?.toFixed(2) || 'N/A'}%)</p>
            </div>
          );
        case 'MOST_DYNAMIC_GAME':
          return (
            <div>
              <p>Turn arounds: {item.value || 'N/A'}</p>
              <p>Players: {item.players?.white?.user?.name || 'Unknown'} vs {item.players?.black?.user?.name || 'Unknown'}</p>
            </div>
          );
        case 'MOST_USED_OPENING':
          return (
            <div>
              <p>Opening: {item.openingName || 'Unknown'}</p>
              <p>Used {item.noOfTimes || 'N/A'} times</p>
            </div>
          );
        case 'MOST_ACCURATE_PLAYER':
          return (
            <div>
              <p>Player: {item.playerName || 'Unknown'}</p>
              <p>Average accuracy: {item.averageAccuracy?.toFixed(2) || 'N/A'}%</p>
              <p>Matches played: {item.noOfMatches || 'N/A'}</p>
            </div>
          );
        case 'HIGHEST_WINNING_STREAK':
          return (
            <div>
              <p>Player(s): {item.playerNames?.join(', ') || 'Unknown'}</p>
              <p>Streak: {item.streakCount || 'N/A'} games</p>
            </div>
          );
        default:
          return <p>{JSON.stringify(item)}</p>;
      }
    };

    return (
      <div key={index} className="mb-2 flex items-start justify-between">
        <div className="flex-grow">{renderContent()}</div>
        {!isPngPreview && !showOnlySelected && (
          <Checkbox
            checked={isSelected}
            onCheckedChange={toggleSelection}
            className="ml-2 mt-1"
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