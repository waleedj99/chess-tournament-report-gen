import React from 'react';
import { Button } from '@/components/ui/button';
import { ExternalLinkIcon } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';

const InsightContent = ({
  insightKey,
  value,
  isPngPreview,
  selectedItems,
  onItemSelection
}) => {
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
                White: {item.players?.white?.user?.name || 'Unknown'}
                {renderPlayerRedirectButton(item.players?.white?.user?.name)}
                (Accuracy: {item.players?.white?.accuracy?.toFixed(2) || 'N/A'}%)
              </p>
              <p>
                Black: {item.players?.black?.user?.name || 'Unknown'}
                {renderPlayerRedirectButton(item.players?.black?.user?.name)}
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
        {!isPngPreview && (
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

  return (
    <div className="space-y-2">
      {Array.isArray(value) ? (
        value.map((item, index) => formatSingleInsight(item, index))
      ) : (
        formatSingleInsight(value, 0)
      )}
    </div>
  );
};

export default InsightContent;
