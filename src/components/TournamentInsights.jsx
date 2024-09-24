import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import InsightContent from './InsightContent';
import AnalysisProgress from './AnalysisProgress';
import { INSIGHTS } from '../utils/constants';

const TournamentInsights = ({ 
  tournamentData, 
  insights,
  analysedGames,
  totalGames,
  selectedInsights, 
  onInsightSelection, 
  showOnlySelected = false, 
  selectedNextBest, 
  onNextBestSelection, 
  isPngPreview = false 
}) => {
  const [expandedInsights, setExpandedInsights] = useState({});

  const toggleExpand = (key) => {
    setExpandedInsights(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const toTitleCase = (str) => {
    return str.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
    ).join(" ");
  };

  const insightsToShow = showOnlySelected 
    ? Object.entries(insights).filter(([key]) => selectedInsights.includes(key))
    : Object.entries(insights);

  return (
    <div className="space-y-6">
      {!showOnlySelected && !isPngPreview && (
        <>
          <h2 className="text-2xl font-bold">Insights for {tournamentData.name}</h2>
          <p>Tournament Type: {tournamentData.type}, Players: {tournamentData.players}, Total Games: {totalGames}</p>
          <AnalysisProgress analyzed={analysedGames} total={totalGames} />
        </>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {insightsToShow.map(([key, value]) => (
          <Card key={key} className={`transition-all ${selectedInsights.includes(key) ? 'ring-2 ring-blue-500 dark:ring-blue-400' : ''}`}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {toTitleCase(key)}
              </CardTitle>
              {!showOnlySelected && !isPngPreview && (
                <Checkbox
                  checked={selectedInsights.includes(key)}
                  onCheckedChange={() => onInsightSelection(key)}
                />
              )}
            </CardHeader>
            <CardContent>
              <InsightContent
                insightKey={key}
                value={value[0]}
                isPngPreview={isPngPreview}
                selectedNextBest={selectedNextBest}
                expandedInsights={expandedInsights}
                toggleExpand={toggleExpand}
                onNextBestSelection={onNextBestSelection}
              />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default TournamentInsights;
