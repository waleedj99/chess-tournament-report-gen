import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';

const TournamentInsights = ({ tournamentData, selectedInsights, onInsightSelection, showOnlySelected = false }) => {
  // Dummy data for insights
  const insights = {
    shortestGame: "Game 12: White vs Black (15 moves)",
    longestGame: "Game 7: Alice vs Bob (78 moves)",
    mostAccurateGame: "Game 3: Charlie vs David (97% accuracy)",
    longestMove: "Game 5: Eve, Move 25 (8 minutes 30 seconds)",
    mostPopularOpening: "Sicilian Defense (23% of games)",
    mostDynamicGame: "Game 18: Frank vs Grace (21 advantage shifts)",
    topPerformers: [
      "1. Alice (95% avg. accuracy, 10 games)",
      "2. Bob (93% avg. accuracy, 9 games)",
      "3. Charlie (91% avg. accuracy, 11 games)"
    ]
  };

  const colors = [
    'bg-blue-100', 'bg-green-100', 'bg-yellow-100', 
    'bg-purple-100', 'bg-pink-100', 'bg-indigo-100', 'bg-red-100',
    'bg-orange-100', 'bg-teal-100', 'bg-cyan-100'
  ];

  const insightsToShow = showOnlySelected 
    ? Object.entries(insights).filter(([key]) => selectedInsights.includes(key))
    : Object.entries(insights);

  return (
    <div className="space-y-6">
      {!showOnlySelected && (
        <>
          <h2 className="text-2xl font-bold">Insights for {tournamentData.name}</h2>
          <p>Tournament Type: {tournamentData.type}, Players: {tournamentData.players}, Total Games: {tournamentData.games}</p>
        </>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {insightsToShow.map(([key, value], index) => (
          <Card key={key} className={`${colors[index % colors.length]} transition-all ${selectedInsights.includes(key) ? 'ring-2 ring-blue-500' : ''}`}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {key.split(/(?=[A-Z])/).join(" ")}
              </CardTitle>
              {!showOnlySelected && (
                <Checkbox
                  checked={selectedInsights.includes(key)}
                  onCheckedChange={() => onInsightSelection(key)}
                />
              )}
            </CardHeader>
            <CardContent>
              {Array.isArray(value) ? (
                <ul>
                  {value.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              ) : (
                <p>{value}</p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default TournamentInsights;