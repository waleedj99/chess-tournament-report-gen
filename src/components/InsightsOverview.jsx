import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { INSIGHTS, INSIGHT_SENTENCE } from '@/utils/constants';

const insightsData = {
  specificGame: [
    INSIGHTS.LONGEST_GAME_BY_MOVES,
    INSIGHTS.SHORTEST_GAME_BY_MOVES,
  ],
  overallTournament: [
    INSIGHTS.AVERAGE_MOVE_COUNT,
    INSIGHTS.MOST_USED_OPENING,
    INSIGHTS.GAME_TERMINATIONS,
  ],
  specificPlayers: [
    INSIGHTS.PLAYER_WITH_HIGHEST_MOVE_AVERAGE,
    INSIGHTS.PLAYER_WITH_LOWEST_MOVE_AVERAGE,
    INSIGHTS.PLAYER_WITH_MOST_CHECKMATES_LOSS,
    INSIGHTS.PLAYER_WITH_MOST_CHECKMATES_LOSS,
    INSIGHTS.PLAYER_WITH_MOST_TIMEOUT_WIN,
    INSIGHTS.PLAYER_WITH_MOST_TIMEOUT_LOSS
  ]
};

const InsightsOverview = () => {
  const toTitleCase = (str) => {
    return str.replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());
  };

  const toListCase = (str) => {
    return str.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
    ).join(" ");
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
                  <li key={index} className="text-sm mb-1">{toListCase(insight)}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        {/* <p className="mt-4 text-sm text-gray-600">
          Note: Some insights like 'Most Dynamic Game', 'Most Accurate Game', and 'Biggest Comeback Win' require game analysis and may take longer to generate.
        </p> */}
      </CardContent>
    </Card>
  );
};

export default InsightsOverview;
