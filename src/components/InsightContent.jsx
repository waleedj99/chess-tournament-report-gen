import React from 'react';
import { Button } from '@/components/ui/button';
import { ExternalLinkIcon } from 'lucide-react';
import { redirectToGame } from '../utils/gameUtils';

const InsightContent = ({
  insightKey,
  value,
  isPngPreview,
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
        return data.map((game, index) => (
          <div key={index} className="mb-2">
            <p>#{index + 1} - Moves: {game.value}</p>
            <p>Players: {game.players.white.user.name} vs {game.players.black.user.name}</p>
            {renderGameRedirectButton(game.gameId)}
          </div>
        ));
      case 'LONGEST_MOVE_BY_TIME':
        return data.map((move, index) => (
          <div key={index} className="mb-2">
            <p>#{index + 1} - Time taken: {move.timeTaken.toFixed(2)} seconds</p>
            <p>Move number: {move.moveNo}</p>
            <p>Side: {move.side}</p>
            <p>Players: {move.players.white.user.name} vs {move.players.black.user.name}</p>
            {renderGameRedirectButton(move.gameId)}
          </div>
        ));
      case 'MOST_ACCURATE_GAME':
        return data.map((game, index) => (
          <div key={index} className="mb-2">
            <p>#{index + 1} - Accuracy: {game.value.toFixed(2)}%</p>
            <p>Players: {game.players.white.user.name} vs {game.players.black.user.name}</p>
            {renderGameRedirectButton(game.gameId)}
          </div>
        ));
      case 'MOST_DYNAMIC_GAME':
        return data.map((game, index) => (
          <div key={index} className="mb-2">
            <p>#{index + 1} - Turn arounds: {game.value}</p>
            <p>Players: {game.players.white.user.name} vs {game.players.black.user.name}</p>
            {renderGameRedirectButton(game.gameId)}
          </div>
        ));
      case 'MOST_USED_OPENING':
        return data.map((opening, index) => (
          <div key={index} className="mb-2">
            <p>#{index + 1} - Opening: {opening.openingName}</p>
            <p>Used {opening.noOfTimes} times</p>
          </div>
        ));
      case 'MOST_ACCURATE_PLAYER':
        return data.map((player, index) => (
          <div key={index} className="mb-2">
            <p>#{index + 1} - Player: {player.playerName}</p>
            <p>Average accuracy: {player.averageAccuracy.toFixed(2)}%</p>
            <p>Matches played: {player.noOfMatches}</p>
          </div>
        ));
      case 'HIGHEST_WINNING_STREAK':
        return data.map((streak, index) => (
          <div key={index} className="mb-2">
            <p>#{index + 1} - Player(s): {streak.playerNames.join(', ')}</p>
            <p>Streak: {streak.streakCount} games</p>
          </div>
        ));
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
