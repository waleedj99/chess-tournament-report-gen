import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import InsightContent from './InsightContent';
import AnalysisProgress from './AnalysisProgress';
import { InfoIcon } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const TournamentInsights = ({ 
  tournamentData, 
  insights = {},
  analysedGames = 0,
  totalGames = 0,
  selectedInsights = {}, 
  onInsightSelection,
  showOnlySelected = false, 
  isPngPreview = false 
}) => {
  const toTitleCase = (str) => {
    return str.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
    ).join(" ");
  };

  const getInsightDescription = (key, value) => {
    switch(key) {
      case 'MOST_ACCURATE_GAME':
        return `${value[0]?.players?.white?.name || 'Unknown'} vs ${value[0]?.players?.black?.name || 'Unknown'} (${value[0]?.value?.toFixed(2)}% accuracy)`;
      case 'SHORTEST_GAME_LENGTH_BY_MOVES':
        return `${value[0]?.players?.white?.name || 'Unknown'} vs ${value[0]?.players?.black?.name || 'Unknown'} (${value[0]?.value} moves)`;
      case 'LONGEST_GAME_LENGTH_BY_MOVES':
        return `${value[0]?.players?.white?.name || 'Unknown'} vs ${value[0]?.players?.black?.name || 'Unknown'} (${value[0]?.value} moves)`;
      case 'LONGEST_MOVE_BY_TIME':
        return `Move ${value[0]?.moveNo || 'N/A'} by ${value[0]?.side || 'N/A'} (${value[0]?.timeTaken?.toFixed(2) || 'N/A'} seconds)`;
      case 'MOST_DYNAMIC_GAME':
        return `${value[0]?.players?.white?.name || 'Unknown'} vs ${value[0]?.players?.black?.name || 'Unknown'} (${value[0]?.value} turn arounds)`;
      default:
        return toTitleCase(key);
    }
  };

  const getInsightTooltip = (key) => {
    switch(key) {
      case 'MOST_ACCURATE_GAME':
        return "Calculated based on the average accuracy of both players in a game.";
      case 'SHORTEST_GAME_LENGTH_BY_MOVES':
        return "Determined by the game with the least number of moves.";
      case 'LONGEST_GAME_LENGTH_BY_MOVES':
        return "Determined by the game with the most number of moves.";
      case 'LONGEST_MOVE_BY_TIME':
        return "Calculated by finding the move that took the most time across all games.";
      case 'MOST_DYNAMIC_GAME':
        return "Based on the number of times the advantage switched between players.";
      default:
        return "Insight calculation method.";
    }
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
        {insightsToShow.map(([key, value]) => (
          <Card key={key} className="flex flex-col">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center text-white font-bold">
                  {key.charAt(0).toUpperCase()}
                </div>
                <div className="flex-grow">
                  <div className="flex items-center">
                    <h3 className="text-sm font-medium mr-2">{toTitleCase(key)}</h3>
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
                  <p className="text-xs text-gray-500">{getInsightDescription(key, value)}</p>
                </div>
              </div>
              {!showOnlySelected && !isPngPreview && (
                <Checkbox
                  checked={selectedInsights[key] && selectedInsights[key].length > 0}
                  onCheckedChange={() => onInsightSelection(key, 0)}
                />
              )}
            </CardHeader>
            <CardContent className="flex-grow">
              <InsightContent
                insightKey={key}
                value={value}
                isPngPreview={isPngPreview}
                selectedItems={selectedInsights[key] || []}
                onItemSelection={onInsightSelection}
                showOnlySelected={showOnlySelected}
              />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default TournamentInsights;