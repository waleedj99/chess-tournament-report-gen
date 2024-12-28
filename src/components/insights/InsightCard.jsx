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
    <div key={index} className="text-xs mb-4 rounded-lg">
      <div className="flex items-center justify-between">
          <InsightFormatter insightKey={insightKey} item={item} />
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