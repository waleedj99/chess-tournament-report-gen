import React from 'react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { ChevronDownIcon, ChevronUpIcon, ExternalLinkIcon } from 'lucide-react';
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

  const renderContent = () => {
    if (typeof value === 'object') {
      return (
        <div>
          {Object.entries(value).map(([key, val]) => (
            <p key={key} className="flex items-center">
              {key}: {val}
              {key === 'gameId' && renderGameRedirectButton(val)}
            </p>
          ))}
        </div>
      );
    } else {
      return (
        <p className="flex items-center">
          {value}
          {value.gameId && renderGameRedirectButton(value.gameId)}
        </p>
      );
    }
  };

  return renderContent();
};

export default InsightContent;
