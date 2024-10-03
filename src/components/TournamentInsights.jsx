import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import InsightContent from './InsightContent';
import AnalysisProgress from './AnalysisProgress';

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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {insightsToShow.map(([key, value]) => (
          <Card key={key} className="flex flex-col">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center text-white font-bold">
                  A
                </div>
                <h3 className="text-sm font-medium">
                  {toTitleCase(key)}
                </h3>
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