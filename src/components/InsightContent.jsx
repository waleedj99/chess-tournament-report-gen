import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ExternalLinkIcon, ChevronDownIcon, ChevronUpIcon } from 'lucide-react';
import { redirectToGame } from '../utils/gameUtils';
import { Toggle } from '@/components/ui/toggle';

const InsightContent = ({
  insightKey,
  value,
  isPngPreview,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const renderGameRedirectButton = (gameId) => {
    return (
      <Button
        variant="ghost"
        size="sm"
        className="ml-2"
        onClick={() => redirectToGame(gameId)}
      >
        <ExternalLinkIcon className="h-4 w-4" />
      </Button>
    );
  };

  const formatSingleInsight = (item, index) => {
    if (!item) return null;

    switch (insightKey) {
      case 'SHORTEST_GAME_LENGTH_BY_MOVES':
      case 'LONGEST_GAME_LENGTH_BY_MOVES':
        return (
          <div key={index} className="mb-2">
            <p>#{index + 1} - Moves: {item.value}</p>
            <p>Players: {item.players?.white?.user?.name || 'Unknown'} vs {item.players?.black?.user?.name || 'Unknown'}</p>
            {item.gameId && renderGameRedirectButton(item.gameId)}
          </div>
        );
      case 'LONGEST_MOVE_BY_TIME':
        return (
          <div key={index} className="mb-2">
            <p>#{index + 1} - Time taken: {item.timeTaken?.toFixed(2) || 'N/A'} seconds</p>
            <p>Move number: {item.moveNo || 'N/A'}</p>
            <p>Side: {item.side || 'N/A'}</p>
            <p>Players: {item.players?.white?.user?.name || 'Unknown'} vs {item.players?.black?.user?.name || 'Unknown'}</p>
            {item.gameId && renderGameRedirectButton(item.gameId)}
          </div>
        );
      case 'MOST_ACCURATE_GAME':
        return (
          <div key={index} className="mb-2">
            <p>#{index + 1} - Accuracy: {item.value?.toFixed(2) || 'N/A'}%</p>
            <p>Players: {item.players?.white?.user?.name || 'Unknown'} vs {item.players?.black?.user?.name || 'Unknown'}</p>
            {item.gameId && renderGameRedirectButton(item.gameId)}
          </div>
        );
      case 'MOST_DYNAMIC_GAME':
        return (
          <div key={index} className="mb-2">
            <p>#{index + 1} - Turn arounds: {item.value || 'N/A'}</p>
            <p>Players: {item.players?.white?.user?.name || 'Unknown'} vs {item.players?.black?.user?.name || 'Unknown'}</p>
            {item.gameId && renderGameRedirectButton(item.gameId)}
          </div>
        );
      case 'MOST_USED_OPENING':
        return (
          <div key={index} className="mb-2">
            <p>#{index + 1} - Opening: {item.openingName || 'Unknown'}</p>
            <p>Used {item.noOfTimes || 'N/A'} times</p>
          </div>
        );
      case 'MOST_ACCURATE_PLAYER':
        return (
          <div key={index} className="mb-2">
            <p>#{index + 1} - Player: {item.playerName || 'Unknown'}</p>
            <p>Average accuracy: {item.averageAccuracy?.toFixed(2) || 'N/A'}%</p>
            <p>Matches played: {item.noOfMatches || 'N/A'}</p>
          </div>
        );
      case 'HIGHEST_WINNING_STREAK':
        return (
          <div key={index} className="mb-2">
            <p>#{index + 1} - Player(s): {item.playerNames?.join(', ') || 'Unknown'}</p>
            <p>Streak: {item.streakCount || 'N/A'} games</p>
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
