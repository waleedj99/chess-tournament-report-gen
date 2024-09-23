import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import InsightContent from './InsightContent';
import AnalysisProgress from './AnalysisProgress';

const TournamentInsights = ({ 
  tournamentData, 
  selectedInsights, 
  onInsightSelection, 
  showOnlySelected = false, 
  selectedNextBest, 
  onNextBestSelection, 
  isPngPreview = false 
}) => {
  const [expandedInsights, setExpandedInsights] = useState({});

  const insights = {
    shortestGame: {
      main: "Game 12: White vs Black (15 moves)",
      nextBest: ["Game 8: Alice vs Eve (17 moves)", "Game 23: Bob vs Charlie (18 moves)"],
      category: "Specific Game",
      needsAnalysis: false
    },
    longestGame: {
      main: "Game 7: Alice vs Bob (78 moves)",
      nextBest: ["Game 15: Charlie vs David (72 moves)", "Game 31: Eve vs Frank (70 moves)"],
      category: "Specific Game",
      needsAnalysis: false
    },
    mostAccurateGame: {
      main: "Game 3: Charlie vs David (97% accuracy)",
      nextBest: ["Game 19: Alice vs Frank (95% accuracy)", "Game 27: Bob vs Eve (94% accuracy)"],
      category: "Specific Game",
      needsAnalysis: true
    },
    longestMove: {
      main: "Game 5: Eve, Move 25 (8 minutes 30 seconds)",
      nextBest: ["Game 11: Alice, Move 18 (7 minutes 45 seconds)", "Game 29: Bob, Move 32 (7 minutes 15 seconds)"],
      category: "Specific Game",
      needsAnalysis: false
    },
    mostPopularOpening: {
      main: "Sicilian Defense (23% of games)",
      nextBest: ["French Defense (18% of games)", "King's Indian Defense (15% of games)"],
      category: "Overall Tournament",
      needsAnalysis: false
    },
    mostDynamicGame: {
      main: "Game 18: Frank vs Grace (21 advantage shifts)",
      nextBest: ["Game 9: Alice vs Charlie (19 advantage shifts)", "Game 25: Bob vs David (18 advantage shifts)"],
      category: "Specific Game",
      needsAnalysis: true
    },
    topPerformers: {
      main: ["1. Alice (95% avg. accuracy, 10 games)", "2. Bob (93% avg. accuracy, 9 games)", "3. Charlie (91% avg. accuracy, 11 games)"],
      nextBest: ["4. David (90% avg. accuracy, 8 games)", "5. Eve (89% avg. accuracy, 10 games)"],
      category: "Specific Players",
      needsAnalysis: true
    },
    averageMoveTime: {
      main: "2 minutes 15 seconds",
      nextBest: [],
      category: "Overall Tournament",
      needsAnalysis: false
    },
    mostBlunders: {
      main: "Player: David (15 blunders in 8 games)",
      nextBest: ["Player: Frank (12 blunders in 9 games)", "Player: Eve (10 blunders in 10 games)"],
      category: "Specific Players",
      needsAnalysis: true
    },
    biggestComebackWin: {
      main: "Game 22: Grace vs Henry (from -5.2 to +1.8)",
      nextBest: ["Game 14: Alice vs David (from -4.8 to +2.1)", "Game 33: Bob vs Frank (from -4.5 to +1.5)"],
      category: "Specific Game",
      needsAnalysis: true
    }
  };

  const toggleExpand = (key) => {
    setExpandedInsights(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const toTitleCase = (str) => {
    return str.split(/(?=[A-Z])/).map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(" ");
  };

  const insightsToShow = showOnlySelected 
    ? Object.entries(insights).filter(([key]) => selectedInsights.includes(key))
    : Object.entries(insights);

  const colors = [
    'bg-blue-100', 'bg-green-100', 'bg-yellow-100', 
    'bg-purple-100', 'bg-pink-100', 'bg-indigo-100', 'bg-red-100',
    'bg-orange-100', 'bg-teal-100', 'bg-cyan-100'
  ];

  return (
    <div className="space-y-6">
      {!showOnlySelected && !isPngPreview && (
        <>
          <h2 className="text-2xl font-bold">Insights for {tournamentData.name}</h2>
          <p>Tournament Type: {tournamentData.type}, Players: {tournamentData.players}, Total Games: {tournamentData.games}</p>
          <AnalysisProgress analyzed={tournamentData.analyzedGames} total={tournamentData.games} />
        </>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {insightsToShow.map(([key, value], index) => (
          <Card key={key} className={`${colors[index % colors.length]} transition-all ${selectedInsights.includes(key) ? 'ring-2 ring-blue-500' : ''}`}>
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
              <p className="text-xs mb-2">
                Category: {value.category}
                {value.needsAnalysis && " (Requires Analysis)"}
              </p>
              <InsightContent
                insightKey={key}
                value={value}
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
