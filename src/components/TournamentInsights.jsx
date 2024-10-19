import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardFooter } from '@/components/ui/card';
import InsightContent from './InsightContent';
import AnalysisProgress from './AnalysisProgress';
import { InfoIcon, ChevronDownIcon, ChevronUpIcon } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Button } from '@/components/ui/button';
import { toTitleCase, getInsightDescription, getInsightTooltip, getInsightIcon } from '../utils/insightHelpers';

const TournamentInsights = ({ 
  tournamentData, 
  insights = {},
  analysedGames = 0,
  totalGames = 0,
  selectedInsights = {
    "MOST_ACCURATE_GAME": [0],
    'SHORTEST_GAME_LENGTH_BY_MOVES': [0],
    'LONGEST_GAME_LENGTH_BY_MOVES': [0],
    'LONGEST_MOVE_BY_TIME': [0],
    'MOST_DYNAMIC_GAME': [0],
    'MOST_USED_OPENING': [0],
    'MOST_ACCURATE_PLAYER': [0],
    'HIGHEST_WINNING_STREAK': [0]
  }, 
  onInsightSelection,
  showOnlySelected = false
}) => {
  const [expandedCards, setExpandedCards] = useState({});

  const getSelectedCardDescriptions = (key, valuesToShow) => {
    return valuesToShow.map((va, index) => (
      <li key={index} className="text-sm text-gray-500">{getInsightDescription(key, va)}</li>
    ));
  };

  const toggleCardExpansion = (key) => {
    setExpandedCards(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const insightsToShow = showOnlySelected 
    ? Object.entries(insights).filter(([key]) => selectedInsights[key] && selectedInsights[key].length > 0)
    : Object.entries(insights);

  return (
    <div className="space-y-6">
      {!showOnlySelected && tournamentData && (
        <>
          <h2 className="text-2xl font-bold">Insights for {tournamentData.name}</h2>
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
            <Card key={key} className="flex flex-col hover:shadow-lg transition-shadow duration-300">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div className="flex items-center space-x-2">
                  <div className="w-10 h-10 rounded-full bg-purple-600 flex items-center justify-center text-white font-bold text-xl">
                    {getInsightIcon(key)}
                  </div>
                  <div className="flex-grow">
                    <div className="flex items-center">
                      <h3 className="text-lg font-medium mr-2">{toTitleCase(key)}</h3>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger>
                            <InfoIcon className="h-4 w-4 text-gray-500" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>{getInsightTooltip(key)}</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                    <ul>
                      {getSelectedCardDescriptions(key, valuesToShow)}
                    </ul>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="flex-grow">
                <InsightContent
                  insightKey={key}
                  value={value}
                  selectedItems={selectedInsights[key] || []}
                  onItemSelection={onInsightSelection}
                  showOnlySelected={showOnlySelected}
                  isExpanded={expandedCards[key]}
                />
              </CardContent>
              <CardFooter className="flex justify-between items-center">
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