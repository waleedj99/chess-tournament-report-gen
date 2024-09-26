import React from 'react';
import { Button } from '@/components/ui/button';
import { ExternalLinkIcon, ChevronDownIcon, ChevronUpIcon } from 'lucide-react';
import { Toggle } from '@/components/ui/toggle';
import { Checkbox } from '@/components/ui/checkbox';

const InsightContent = ({
  insightKey,
  value,
  isPngPreview,
  selectedValues,
  onValueSelection,
}) => {
  const [isExpanded, setIsExpanded] = React.useState(false);

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

    const renderCheckbox = () => {
      if (isPngPreview) return null;
      return (
        <Checkbox
          checked={selectedValues.includes(index)}
          onCheckedChange={(checked) => onValueSelection(index, checked)}
          className="mr-2"
        />
      );
    };

    switch (insightKey) {
      case 'SHORTEST_GAME_BY_MOVES':
      case 'LONGEST_GAME_BY_MOVES':
        return (
          <div key={index} className="mb-2 flex items-start">
            {renderCheckbox()}
            <div>
              <p>#{index + 1} - Moves: {item.value}</p>
              <p>
                Players: {item.players?.white?.user?.name || 'Unknown'}
                {renderPlayerRedirectButton(item.players?.white?.user?.name)}
                vs {item.players?.black?.user?.name || 'Unknown'}
                {renderPlayerRedirectButton(item.players?.black?.user?.name)}
              </p>
              {item.gameId && renderGameRedirectButton(item.gameId)}
            </div>
          </div>
        );
      case 'LONGEST_MOVE_BY_TIME':
        return (
          <div key={index} className="mb-2 flex items-start">
            {renderCheckbox()}
            <div>
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
            </div>
          </div>
        );
      case 'MOST_ACCURATE_GAME':
        return (
          <div key={index} className="mb-2 flex items-start">
            {renderCheckbox()}
            <div>
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
            </div>
          </div>
        );
      case 'MOST_DYNAMIC_GAME':
        return (
          <div key={index} className="mb-2 flex items-start">
            {renderCheckbox()}
            <div>
              <p>#{index + 1} - Turn arounds: {item.value || 'N/A'}</p>
              <p>
                Players: {item.players?.white?.user?.name || 'Unknown'}
                {renderPlayerRedirectButton(item.players?.white?.user?.name)}
                vs {item.players?.black?.user?.name || 'Unknown'}
                {renderPlayerRedirectButton(item.players?.black?.user?.name)}
              </p>
              {item.gameId && renderGameRedirectButton(item.gameId)}
            </div>
          </div>
        );
      case 'MOST_USED_OPENING':
        return (
          <div key={index} className="mb-2 flex items-start">
            {renderCheckbox()}
            <div>
              <p>#{index + 1} - Opening: {item.openingName || 'Unknown'}</p>
              <p>Used {item.noOfTimes || 'N/A'} times</p>
            </div>
          </div>
        );
      case 'MOST_ACCURATE_PLAYER':
        return (
          <div key={index} className="mb-2 flex items-start">
            {renderCheckbox()}
            <div>
              <p>
                #{index + 1} - Player: {item.playerName || 'Unknown'}
                {renderPlayerRedirectButton(item.playerName)}
              </p>
              <p>Average accuracy: {item.averageAccuracy?.toFixed(2) || 'N/A'}%</p>
              <p>Matches played: {item.noOfMatches || 'N/A'}</p>
            </div>
          </div>
        );
      case 'HIGHEST_WINNING_STREAK':
        return (
          <div key={index} className="mb-2 flex items-start">
            {renderCheckbox()}
            <div>
              <p>
                #{index + 1} - Player(s): {item.playerNames?.map(name => (
                  <span key={name}>
                    {name}
                    {renderPlayerRedirectButton(name)}
                  </span>
                )) || 'Unknown'}
              </p>
              <p>Streak: {item.streakCount || 'N/A'} games</p>
            </div>
          </div>
        );
      default:
        return <p key={index}>{JSON.stringify(item)}</p>;
    }
  };

  const formatInsight = (key, data, showAll = false) => {
    if (!Array.isArray(data) || data.length === 0) {
      return <p>No data available for this insight.</p>;
    }
    return showAll ? data.map(formatSingleInsight) : formatSingleInsight(data[0], 0);
  };

  return (
    <div className="space-y-2">
      {formatInsight(insightKey, value, false)}
      {!isPngPreview && value && value.length > 1 && (
        <Toggle
          aria-label="Toggle insight expansion"
          pressed={isExpanded}
          onPressedChange={setIsExpanded}
          className="w-full justify-between"
        >
          {isExpanded ? 'Show less' : 'Show more'}
          {isExpanded ? <ChevronUpIcon className="h-4 w-4" /> : <ChevronDownIcon className="h-4 w-4" />}
        </Toggle>
      )}
      {isExpanded && formatInsight(insightKey, value.slice(1), true)}
    </div>
  );
};

export default InsightContent;
