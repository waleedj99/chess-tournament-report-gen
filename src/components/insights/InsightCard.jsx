import React from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import GameRedirectButton from './GameRedirectButton';
import InsightFormatter from './InsightFormatter';

const InsightCard = ({ 
  item, 
  index, 
  insightKey, 
  isPngPreview, 
  showOnlySelected, 
  isSelected, 
  onToggleSelection 
}) => {
  return (
    <div key={index} className="mb-4 p-6 bg-gray-900 dark:bg-gray-800 rounded-lg">
      <div className="flex items-center justify-between">
        <p className="flex-grow text-xl text-white">
          <InsightFormatter insightKey={insightKey} item={item} />
        </p>
        {!isPngPreview && !showOnlySelected && (
          <Checkbox
            checked={isSelected}
            onCheckedChange={onToggleSelection}
            className="ml-2"
          />
        )}
      </div>
      {item.gameId && <GameRedirectButton gameId={item.gameId} />}
    </div>
  );
};

export default InsightCard;