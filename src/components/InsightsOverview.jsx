import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const insightsData = {
  specificGame: [
    "Shortest Game",
    "Longest Game",
    "Most Accurate Game",
    "Longest Move",
    "Most Dynamic Game",
    "Biggest Comeback Win"
  ],
  overallTournament: [
    "Most Popular Opening",
    "Average Move Time"
  ],
  specificPlayers: [
    "Top Performers",
    "Most Blunders"
  ]
};

const InsightsOverview = () => {
  const toTitleCase = (str) => {
    return str.replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());
  };

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Available Insights</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {Object.entries(insightsData).map(([category, insights]) => (
            <div key={category}>
              <h3 className="font-semibold mb-2 text-lg">{toTitleCase(category.replace(/([A-Z])/g, ' $1').trim())}</h3>
              <ul className="list-disc pl-5">
                {insights.map((insight, index) => (
                  <li key={index} className="text-sm mb-1">{insight}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <p className="mt-4 text-sm text-gray-600">
          Note: Some insights like 'Most Dynamic Game', 'Most Accurate Game', and 'Biggest Comeback Win' require game analysis and may take longer to generate.
        </p>
      </CardContent>
    </Card>
  );
};

export default InsightsOverview;
