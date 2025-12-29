import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ChevronDown } from 'lucide-react';
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

const InsightsOverview = ({ tournamentId, setTournamentId, setTournamentType, handleFetchData }) => {
  const [isOpen, setIsOpen] = React.useState(false);

  const toTitleCase = (str) => {
    return str.replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());
  };

  const toListCase = (str) => {
    return str.split('_').map(word =>
      word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
    ).join(" ");
  };

  return (
    <Card className="mb-4">
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CollapsibleTrigger asChild>
            <div className="flex items-center gap-2 cursor-pointer hover:opacity-80">
              <CardTitle>Available Insights</CardTitle>
              <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${isOpen ? "transform rotate-180" : ""}`} />
            </div>
          </CollapsibleTrigger>

          <div className="flex gap-2 flex-1 max-w-2xl pl-4" onClick={(e) => e.stopPropagation()}>
            <Input
              type="text"
              placeholder="Enter tournament URL"
              value={tournamentId}
              onChange={(e) => {
                const value = e.target.value;
                const swissMatch = value.match(/lichess\.org\/swiss\/([a-zA-Z0-9]+)/i);
                const arenaMatch = value.match(/lichess\.org\/tournament\/([a-zA-Z0-9]+)/i);

                if (swissMatch) {
                  setTournamentType('swiss');
                  setTournamentId(swissMatch[1]);
                } else if (arenaMatch) {
                  setTournamentType('arena');
                  setTournamentId(arenaMatch[1]);
                } else {
                  setTournamentId(value);
                }
              }}
              className="flex-1"
            />
            <Button onClick={handleFetchData}>Fetch Data</Button>
          </div>
        </CardHeader>
        <CollapsibleContent>
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
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
};

export default InsightsOverview;
