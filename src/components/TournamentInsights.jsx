import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardFooter } from '@/components/ui/card';
import InsightContent from './InsightContent';
import InsightFormatter from './insights/InsightFormatter';
import AnalysisProgress from './AnalysisProgress';
import { InfoIcon, ChevronDownIcon, ChevronUpIcon } from 'lucide-react';
import GameTerminationsPieChart from './insights/GameTerminationsPieChart';
import { INSIGHTS, INSIGHT_SENTENCE } from '@/utils/constants';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from '@/components/ui/button';

const TournamentInsights = ({ 
  tournamentData, 
  insights = {},
  analysedGames = 0,
  totalGames = 0,
  selectedInsights, 
  onInsightSelection,
  showOnlySelected = false, 
  isPngPreview = false 
}) => {
  const [expandedCards, setExpandedCards] = useState({});

  const toTitleCase = (str) => {
    return str.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
    ).join(" ");
  };

  const getSelectedCardDesciptions = (key, valuesToShow) => {
    if (key === INSIGHTS.GAME_TERMINATIONS) {
      return <GameTerminationsPieChart data={valuesToShow} />;
    }
    return valuesToShow.map(va => {
      return <li key={va.id || Math.random()} className='text-xl text-center'><InsightFormatter insightKey={key} item={va} /></li>
    });
  };

  const toggleCardExpansion = (key) => {
    setExpandedCards(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const insightsToShow = showOnlySelected 
    ? Object.entries(insights).filter(([key]) => selectedInsights[key] && selectedInsights[key].length > 0)
    : Object.entries(insights);

  return (
    <div className="space-y-6">
      {!showOnlySelected && !isPngPreview && tournamentData && (
        <>
          <h2 className="text-2xl font-bold">Insights from {tournamentData.name}</h2>
          <p>Tournament Type: {tournamentData.type}, Players: {tournamentData.players}, Total Games: {totalGames}</p>
          <AnalysisProgress analyzed={analysedGames} total={totalGames} />
        </>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {insightsToShow.map(([key, value]) => { 
          let selectedItems = selectedInsights[key] || [];
          const values = Array.isArray(value) ? value : [value];
          const valuesToShow = values.filter((_, index) => selectedItems.includes(index));
          
          return (
            <Card 
              key={key} 
              className={`flex flex-col hover:shadow-lg transition-shadow duration-300 ${
                expandedCards[key] ? 'h-auto' : 'h-[300px]'
              }`}
            >
              <CardHeader className="flex flex-row items-center justify-between">
                <div className="flex-grow">
                  <div className="flex items-center justify-center">
                    <h3 className="text-lg font-medium mr-2">{toTitleCase(key)}</h3>
                  </div>
                </div>
              </CardHeader>
              <CardContent className={`flex-grow content-center justify-center pb-0 ${
                expandedCards[key] ? 'overflow-y-auto' : 'overflow-hidden'
              }`}>
                <ul className='pb-3'>
                  {getSelectedCardDesciptions(key, valuesToShow)}
                </ul>
                <InsightContent
                  insightKey={key}
                  value={value}
                  isPngPreview={isPngPreview}
                  selectedItems={selectedInsights[key] || []}
                  onItemSelection={onInsightSelection}
                  showOnlySelected={showOnlySelected}
                  isExpanded={expandedCards[key]}
                />
              </CardContent>
              <CardFooter className="flex justify-between items-center mt-auto">
                <Button variant="ghost" size="sm" onClick={() => toggleCardExpansion(key)}>
                  {expandedCards[key] ? (
                    <>
                      <ChevronUpIcon className="h-4 w-4 mr-2" />
                      Show Less
                    </>
                  ) : (
                    <>
                      <ChevronDownIcon className="h-4 w-4 mr-2" />
                      Show More
                    </>
                  )}
                </Button>
              </CardFooter>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default TournamentInsights;