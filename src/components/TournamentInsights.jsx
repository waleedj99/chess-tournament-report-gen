import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardFooter } from '@/components/ui/card';
import InsightContent from './InsightContent';
import InsightFormatter from './insights/InsightFormatter';
import AnalysisProgress from './AnalysisProgress';
import { InfoIcon, ChevronDownIcon, ChevronUpIcon } from 'lucide-react';
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
  selectedInsights = {"MOST_ACCURATE_GAME" : [0],
    'SHORTEST_GAME_BY_MOVES':[0],
    'LONGEST_GAME_BY_MOVES':[0],
    'LONGEST_MOVE_BY_TIME':[0],
    'MOST_DYNAMIC_GAME':[0],
    'MOST_USED_OPENING':[0],
    'MOST_ACCURATE_PLAYER':[0],
    'HIGHEST_WINNING_STREAK':[0]}, 
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

  const getInsightDescription = (insightKey, item) => {
    switch (insightKey) {
      case INSIGHTS.MOST_ACCURATE_GAME:
        return `${item.players?.white?.name || 'Unknown'} vs ${item.players?.black?.name || 'Unknown'} had an average accuracy of ${item.value?.toFixed(2)}%.`;
      case INSIGHTS.SHORTEST_GAME_BY_MOVES:
      case INSIGHTS.LONGEST_GAME_BY_MOVES:
        return `${item.players?.white?.user?.name || 'Unknown'} vs ${item.players?.black?.user?.name || 'Unknown'} played a game lasting ${item.value} moves.`;
      case INSIGHTS.LONGEST_MOVE_BY_TIME:
        return `Move ${item.moveNo || 'N/A'} by ${item.side || 'N/A'} took ${item.timeTaken?.toFixed(2) || 'N/A'} seconds.`;
      case INSIGHTS.MOST_DYNAMIC_GAME:
        return `${item.players?.white?.user?.name || 'Unknown'} vs ${item.players?.black?.user?.name || 'Unknown'} had ${item.value} turn arounds.`;
      case INSIGHTS.MOST_USED_OPENING:
        return `${item.openingName || 'Unknown'} was used ${item.noOfTimes || 'N/A'} times.`;
      case INSIGHTS.MOST_ACCURATE_PLAYER:
        return `${item.playerName || 'Unknown'} had an average accuracy of ${item.averageAccuracy?.toFixed(2) || 'N/A'}% over ${item.noOfMatches || 'N/A'} matches.`;
      case INSIGHTS.HIGHEST_WINNING_STREAK:
        return `${item.playerNames?.join(', ') || 'Unknown'} had a winning streak of ${item.streakCount || 'N/A'} games.`;
      default:
        return JSON.stringify(item);
    }
  };

  const getInsightTooltip = (key) => {
    switch(key) {
      case INSIGHTS.MOST_ACCURATE_GAME:
        return "Calculated based on the average accuracy of both players in a game.";
      case INSIGHTS.SHORTEST_GAME_BY_MOVES:
        return "Determined by the game with the least number of moves.";
      case INSIGHTS.LONGEST_GAME_BY_MOVES:
        return "Determined by the game with the most number of moves.";
      case INSIGHTS.LONGEST_MOVE_BY_TIME:
        return "Calculated by finding the move that took the most time across all games.";
      case INSIGHTS.MOST_DYNAMIC_GAME:
        return "Based on the number of times the advantage switched between players.";
      default:
        return "Insight calculation method.";
    }
  };

  const getInsightIcon = (key) => {
    return '🏆';
  };

  const getSelectedCardDesciptions = (key, valuesToShow) => {
    return valuesToShow.map(va => {
      return <InsightFormatter insightKey={key} item={va} />
      // return <li className="text-lg text-gray-500">{getInsightDescription(key, va)}</li>
    })
  }

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
          <h2 className="text-2xl font-bold">Insights for {tournamentData.name}</h2>
          <p>Tournament Type: {tournamentData.type}, Players: {tournamentData.players}, Total Games: {totalGames}</p>
          <AnalysisProgress analyzed={analysedGames} total={totalGames} />
        </>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {insightsToShow.map(([key, value]) => { 
          console.log(insightsToShow)
            let selectedItems= selectedInsights[key] || []
            const values = Array.isArray(value) ? value : [value];
            const valuesToShow = values.filter((_, index) => selectedItems.includes(index))
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
                  <ul >
                    {getSelectedCardDesciptions(key, valuesToShow)}
                  </ul>
                  
                </div>
              </div>
            </CardHeader>
            <CardContent className="flex-grow">
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
        )})}
      </div>
    </div>
  );
};

export default TournamentInsights;