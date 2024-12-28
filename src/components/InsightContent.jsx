import React from 'react';
import InsightCard from './insights/InsightCard';

const InsightContent = ({
  insightKey,
  value,
  isPngPreview,
  selectedItems,
  onItemSelection,
  showOnlySelected,
  isExpanded
}) => {
  const values = Array.isArray(value) ? value : [value];
  const valuesToShow = showOnlySelected ? values.filter((_, index) => selectedItems.includes(index)) : values;

  return (
    <div className='border-t-2 pt-2'>
      {isExpanded ? (
        valuesToShow.map((item, index) => (
          item && (
            <InsightCard
              key={index}
              item={item}
              index={index}
              insightKey={insightKey}
              isPngPreview={isPngPreview}
              showOnlySelected={showOnlySelected}
              isSelected={selectedItems.includes(index)}
              onToggleSelection={() => onItemSelection(insightKey, index)}
            />
          )
        ))
      ) : <></>}
    </div>
  );
};

export default InsightContent;