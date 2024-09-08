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
  const renderGameRedirectButton = (gameInfo) => {
    const gameId = gameInfo.split(':')[0].split(' ')[1];
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
    if (isPngPreview) {
      if (selectedNextBest[insightKey] && selectedNextBest[insightKey].length > 0) {
        return (
          <ul>
            {selectedNextBest[insightKey].map(index => (
              <li key={index} className="flex items-center">
                {value.nextBest[index]}
                {renderGameRedirectButton(value.nextBest[index])}
              </li>
            ))}
          </ul>
        );
      } else {
        return Array.isArray(value.main) ? (
          <ul>
            {value.main.map((item, i) => (
              <li key={i} className="flex items-center">
                {item}
                {renderGameRedirectButton(item)}
              </li>
            ))}
          </ul>
        ) : (
          <p className="flex items-center">
            {value.main}
            {renderGameRedirectButton(value.main)}
          </p>
        );
      }
    } else {
      return (
        <>
          {Array.isArray(value.main) ? (
            <ul>
              {value.main.map((item, i) => (
                <li key={i} className="flex items-center">
                  {item}
                  {renderGameRedirectButton(item)}
                </li>
              ))}
            </ul>
          ) : (
            <p className="flex items-center">
              {value.main}
              {renderGameRedirectButton(value.main)}
            </p>
          )}
          {value.nextBest && value.nextBest.length > 0 && (
            <div className="mt-2">
              <Button
                variant="ghost"
                size="sm"
                className="p-0 h-6 text-xs"
                onClick={() => toggleExpand(insightKey)}
              >
                {expandedInsights[insightKey] ? (
                  <>
                    <ChevronUpIcon className="h-4 w-4 mr-1" />
                    Hide next best
                  </>
                ) : (
                  <>
                    <ChevronDownIcon className="h-4 w-4 mr-1" />
                    Show next best
                  </>
                )}
              </Button>
              {expandedInsights[insightKey] && (
                <ul className="mt-2 text-sm">
                  {value.nextBest.map((item, i) => (
                    <li key={i} className="flex items-center">
                      <Checkbox
                        checked={selectedNextBest[insightKey]?.includes(i)}
                        onCheckedChange={() => onNextBestSelection(insightKey, i)}
                        className="mr-2"
                      />
                      <span className={selectedNextBest[insightKey]?.includes(i) ? 'font-semibold' : 'text-gray-600'}>
                        {item}
                      </span>
                      {renderGameRedirectButton(item)}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </>
      );
    }
  };

  return renderContent();
};

export default InsightContent;