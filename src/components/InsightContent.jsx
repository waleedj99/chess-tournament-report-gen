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
            <>
              <p>#{index + 1} - Moves: {item.value}</p>
              <p>
                Players: {item.players?.white?.user?.name || 'Unknown'}
                {renderPlayerRedirectButton(item.players?.white?.user?.name)}
                vs {item.players?.black?.user?.name || 'Unknown'}
                {renderPlayerRedirectButton(item.players?.black?.user?.name)}
              </p>
              {item.gameId && renderGameRedirectButton(item.gameId)}
            </>
          );
        case 'LONGEST_MOVE_BY_TIME':
          return (
            <>
              <p>#{index + 1} - Time taken: {item.timeTaken?.toFixed(2) || 'N/A'} seconds</p>
              <p>Move number: {item.moveNo || 'N/A'}</p>
              <p>Side: {item.side || 'N/A'}</p>
              <p>
                Players: {item.players?.white?.user?.name || 'Unknown'}
                {renderPlayerRedirectButton(item.players?.white?.user?.name)}
                vs {item.players?.black?.user?.name || 'Unknown'}
                {renderPlayerRedirectButton(item.players?.black?.user?.name)}
              </p>
              {item.gameId && renderGameRedirectButton(item.gameId)}
            </>
          );
        case 'MOST_ACCURATE_GAME':
          return (
            <>
              <p>#{index + 1} - Average Accuracy: {item.value?.toFixed(2) || 'N/A'}%</p>
              <p>
                White: {item.players?.white?.name || 'Unknown'}
                {renderPlayerRedirectButton(item.players?.white?.name)}
                (Accuracy: {item.players?.white?.accuracy?.toFixed(2) || 'N/A'}%)
              </p>
              <p>
                Black: {item.players?.black?.name || 'Unknown'}
                {renderPlayerRedirectButton(item.players?.black?.name)}
                (Accuracy: {item.players?.black?.accuracy?.toFixed(2) || 'N/A'}%)
              </p>
              {item.gameId && renderGameRedirectButton(item.gameId)}
            </>
          );
        case 'MOST_DYNAMIC_GAME':
          return (
            <>
              <p>#{index + 1} - Turn arounds: {item.value || 'N/A'}</p>
              <p>
                Players: {item.players?.white?.user?.name || 'Unknown'}
                {renderPlayerRedirectButton(item.players?.white?.user?.name)}
                vs {item.players?.black?.user?.name || 'Unknown'}
                {renderPlayerRedirectButton(item.players?.black?.user?.name)}
              </p>
              {item.gameId && renderGameRedirectButton(item.gameId)}
            </>
          );
        case 'MOST_USED_OPENING':
          return (
            <>
              <p>#{index + 1} - Opening: {item.openingName || 'Unknown'}</p>
              <p>Used {item.noOfTimes || 'N/A'} times</p>
            </>
          );
        case 'MOST_ACCURATE_PLAYER':
          return (
            <>
              <p>
                #{index + 1} - Player: {item.playerName || 'Unknown'}
                {renderPlayerRedirectButton(item.playerName)}
              </p>
              <p>Average accuracy: {item.averageAccuracy?.toFixed(2) || 'N/A'}%</p>
              <p>Matches played: {item.noOfMatches || 'N/A'}</p>
            </>
          );
        case 'HIGHEST_WINNING_STREAK':
          return (
            <>
              <p>
                #{index + 1} - Player(s): {item.playerNames?.map(name => (
                  <span key={name}>
                    {name}
                    {renderPlayerRedirectButton(name)}
                  </span>
                )) || 'Unknown'}
              </p>
              <p>Streak: {item.streakCount || 'N/A'} games</p>
            </>
          );
        default:
          return <p>{JSON.stringify(item)}</p>;
      }
    };

    return (
      <div key={index} className="mb-2 flex items-start">
        {!isPngPreview && !showOnlySelected && (
          <Checkbox
            checked={isSelected}
            onCheckedChange={toggleSelection}
            className="mr-2 mt-1"
          />
        )}
        <div>{renderContent()}</div>
      </div>
    );
  };

  const values = Array.isArray(value) ? value : [value];
  const valuesToShow = showOnlySelected ? values.filter((_, index) => selectedItems.includes(index)) : values;

  return (
    <div className="space-y-2">
      {formatSingleInsight(valuesToShow[0], 0)}
      {!isPngPreview && valuesToShow.length > 1 && (
        <div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            className="mt-2"
          >
            {isExpanded ? (
              <>
                <ChevronUpIcon className="mr-2 h-4 w-4" />
                Hide additional values
              </>
            ) : (
              <>
                <ChevronDownIcon className="mr-2 h-4 w-4" />
                Show {valuesToShow.length - 1} more values
              </>
            )}
          </Button>
          {isExpanded && (
            <div className="mt-2 space-y-2">
              {valuesToShow.slice(1).map((item, index) => formatSingleInsight(item, index + 1))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default InsightContent;
