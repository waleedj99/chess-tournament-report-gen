import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import TournamentInsights from './TournamentInsights';
import PngPreview from './PngPreview';
import { toPng } from 'html-to-image';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { InfoIcon } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import InsightsOverview from './InsightsOverview';
import calculateAllInsights from '../utils/insightsCalculator';
import { INSIGHTS } from '../utils/constants';

const fetchTournamentData = async ({ tournamentType, tournamentId }) => {
  // Simulating API call with dummy data
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        id: tournamentId,
        type: tournamentType,
        name: "Chess Masters 2023",
        players: 64,
        games: [
          {
            id: '1',
            players: { white: { user: { name: 'Player1' } }, black: { user: { name: 'Player2' } } },
            winner: 'white',
            moves: 'e4 e5 Nf3 Nc6',
            clocks: [300, 290, 285, 280],
            opening: { name: 'Italian Game' },
            analysis: [{ eval: 0.5 }, { eval: -0.2 }, { eval: 0.3 }],
          },
          // Add more dummy games here if needed
        ],
      });
    }, 1000);
  });
};

const ChessInsightsApp = () => {
  const [tournamentType, setTournamentType] = useState('swiss');
  const [tournamentId, setTournamentId] = useState('');
  const [isDataFetched, setIsDataFetched] = useState(false);
  const [selectedInsights, setSelectedInsights] = useState([]);
  const [selectedNextBest, setSelectedNextBest] = useState({});
  const [pngPreview, setPngPreview] = useState(null);

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['tournamentData', tournamentType, tournamentId],
    queryFn: () => fetchTournamentData({ tournamentType, tournamentId }),
    enabled: false,
  });

  const handleFetchData = () => {
    if (tournamentId) {
      refetch();
      setIsDataFetched(true);
    }
  };

  const handleInsightSelection = (insight) => {
    setSelectedInsights(prev => 
      prev.includes(insight) 
        ? prev.filter(i => i !== insight)
        : [...prev, insight]
    );
  };

  const handleNextBestSelection = (key, index) => {
    setSelectedNextBest(prev => {
      const currentSelection = prev[key] || [];
      return {
        ...prev,
        [key]: currentSelection.includes(index)
          ? currentSelection.filter(i => i !== index)
          : [...currentSelection, index]
      };
    });
  };

  const generatePng = async () => {
    const element = document.getElementById('selected-insights-container');
    if (element) {
      const dataUrl = await toPng(element, {
        width: 800,
        height: 800,
        style: {
          transform: 'scale(2)',
          transformOrigin: 'top left',
          width: '400px',
          height: '400px'
        }
      });
      setPngPreview(dataUrl);
    }
  };

  const calculatedInsights = data ? calculateAllInsights(data.games, Object.values(INSIGHTS)) : null;

  return (
    <div className="space-y-6">
      <InsightsOverview />
      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Select value={tournamentType} onValueChange={setTournamentType}>
              <SelectTrigger>
                <SelectValue placeholder="Select tournament type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="swiss">Swiss</SelectItem>
                <SelectItem value="arena">Arena</SelectItem>
              </SelectContent>
            </Select>
            <Input
              type="text"
              placeholder="Enter tournament ID"
              value={tournamentId}
              onChange={(e) => setTournamentId(e.target.value)}
            />
            <Button onClick={handleFetchData}>Fetch Data</Button>
          </div>
        </CardContent>
      </Card>

      {isLoading && <p>Loading tournament data...</p>}
      {error && <p className="text-red-500">Error: {error.message}</p>}
      {isDataFetched && data && (
        <Alert>
          <InfoIcon className="h-4 w-4" />
          <AlertDescription>
            Some insights require game analysis. This process may take some time depending on the number of games.
          </AlertDescription>
        </Alert>
      )}
      {isDataFetched && calculatedInsights && (
        <div>
          <TournamentInsights 
            tournamentData={data} 
            insights={calculatedInsights}
            analysedGames={calculatedInsights.analysedGames}
            totalGames={calculatedInsights.totalGames}
            selectedInsights={selectedInsights}
            onInsightSelection={handleInsightSelection}
            selectedNextBest={selectedNextBest}
            onNextBestSelection={handleNextBestSelection}
          />
          <div id="selected-insights-container" className="mt-6 p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
            <h2 className="text-2xl font-bold mb-4">{data.name} Insights</h2>
            <TournamentInsights 
              tournamentData={data}
              insights={calculatedInsights}
              analysedGames={calculatedInsights.analysedGames}
              totalGames={calculatedInsights.totalGames}
              selectedInsights={selectedInsights}
              onInsightSelection={() => {}}
              showOnlySelected={true}
              selectedNextBest={selectedNextBest}
              onNextBestSelection={() => {}}
              isPngPreview={true}
            />
          </div>
        </div>
      )}

      {isDataFetched && calculatedInsights && (
        <Card>
          <CardContent className="pt-6">
            <Button onClick={generatePng} disabled={selectedInsights.length === 0}>
              Generate PNG
            </Button>
            {pngPreview && <PngPreview imageUrl={pngPreview} />}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ChessInsightsApp;
