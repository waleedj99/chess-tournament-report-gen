import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronUp } from 'lucide-react';
import InsightContent from './InsightContent';
import AnalysisProgress from './AnalysisProgress';
import { INSIGHTS } from '../utils/constants';

const TournamentInsights = ({ 
  tournamentData, 
  insights = {},
  analysedGames = 0,
  totalGames = 0,
  selectedInsights = {}, 
  expandedInsights = {},
  onInsightSelection, 
  onItemSelection,
  onInsightExpansion,
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {insightsToShow.map(([key, value]) => (
          <Card key={key} className={`transition-all ${selectedInsights[key] && selectedInsights[key].length > 0 ? 'ring-2 ring-blue-500 dark:ring-blue-400' : ''}`}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {toTitleCase(key)}
              </CardTitle>
              {!showOnlySelected && !isPngPreview && (
                <div className="flex items-center space-x-2">
                  <Checkbox
                    checked={selectedInsights[key] && selectedInsights[key].length > 0}
                    onCheckedChange={() => onInsightSelection(key)}
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onInsightExpansion(key)}
                  >
                    {expandedInsights[key] ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                  </Button>
                </div>
              )}
            </CardHeader>
            <CardContent>
              <InsightContent
                insightKey={key}
                value={value}
                isPngPreview={isPngPreview}
                selectedItems={selectedInsights[key] || []}
                onItemSelection={onItemSelection}
                expanded={expandedInsights[key]}
              />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default TournamentInsights;
