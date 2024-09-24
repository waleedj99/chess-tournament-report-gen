import React from 'react';
import { Button } from '@/components/ui/button';
import { ExternalLinkIcon } from 'lucide-react';
import { redirectToGame } from '../utils/gameUtils';

const InsightContent = ({
  insightKey,
  value,
  isPngPreview,
  selectedNextBest,
  expandedInsights,
  toggleExpand,
  onNextBestSelection
}) => {
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

  const formatInsight = (key, data) => {
    switch (key) {
      case 'SHORTEST_GAME_LENGTH_BY_MOVES':
      case 'LONGEST_GAME_LENGTH_BY_MOVES':
        return (
          <div>
            <p>Moves: {data.value}</p>
            <p>Players: {data.players.white.user.name} vs {data.players.black.user.name}</p>
            {renderGameRedirectButton(data.gameId)}
          </div>
        );
      case 'LONGEST_MOVE_BY_TIME':
        return (
          <div>
            <p>Time taken: {data.timeTaken.toFixed(2)} seconds</p>
            <p>Move number: {data.moveNo}</p>
            <p>Side: {data.side}</p>
            <p>Players: {data.players.white.user.name} vs {data.players.black.user.name}</p>
            {renderGameRedirectButton(data.gameId)}
          </div>
        );
      case 'MOST_ACCURATE_GAME':
        return (
          <div>
            <p>Accuracy: {data.value.toFixed(2)}%</p>
            <p>Players: {data.players.white.user.name} vs {data.players.black.user.name}</p>
            {renderGameRedirectButton(data.gameId)}
          </div>
        );
      case 'MOST_DYNAMIC_GAME':
        return (
          <div>
            <p>Turn arounds: {data.value}</p>
            <p>Players: {data.players.white.user.name} vs {data.players.black.user.name}</p>
            {renderGameRedirectButton(data.gameId)}
          </div>
        );
      case 'MOST_USED_OPENING':
        return (
          <div>
            <p>Opening: {data.openingName}</p>
            <p>Used {data.noOfTimes} times</p>
          </div>
        );
      case 'MOST_ACCURATE_PLAYER':
        return (
          <div>
            <p>Player: {data.playerName}</p>
            <p>Average accuracy: {data.averageAccuracy.toFixed(2)}%</p>
            <p>Matches played: {data.noOfMatches}</p>
          </div>
        );
      case 'HIGHEST_WINNING_STREAK':
        return (
          <div>
            <p>Player(s): {data.playerNames.join(', ')}</p>
            <p>Streak: {data.streakCount} games</p>
          </div>
        );
      default:
        return <p>{JSON.stringify(data)}</p>;
    }
  };

  return (
    <div className="space-y-2">
      {formatInsight(insightKey, value)}
    </div>
  );
};

export default InsightContent;
