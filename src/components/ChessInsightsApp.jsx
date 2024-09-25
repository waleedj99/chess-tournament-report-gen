import React, { useState, useEffect } from 'react';
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

const ChessInsightsApp = () => {
  const [tournamentType, setTournamentType] = useState('swiss');
  const [tournamentId, setTournamentId] = useState('');
  const [isDataFetched, setIsDataFetched] = useState(false);
  const [selectedInsights, setSelectedInsights] = useState([]);
  const [pngPreview, setPngPreview] = useState(null);
  const [tournamentGames, setTournamentGames] = useState([]);
  const [calculatedInsights, setCalculatedInsights] = useState(null);

  const fetchGames = async () => {
    let fetchData = [];
    var requestOptions = {
      method: 'GET',
      headers: {
        "Content-Type": "application/x-ndjson",
        "Accept": "application/x-ndjson"
      },
      redirect: 'follow'
    };

    try {
      const response = await fetch(`https://lichess.org/api/${tournamentType}/${tournamentId}/games?evals=true&accuracy=true&clocks=true&opening=true`, requestOptions);
      const reader = response.body.getReader();
      let chunk = '';

      const read = async () => {
        const { done, value } = await reader.read();
        if (done) return;

        chunk += new TextDecoder().decode(value);
        const lines = chunk.split('\n');

        for (let i = 0; i < lines.length - 1; i++) {
          const jsonLine = lines[i];
          const jsonObject = JSON.parse(jsonLine);
          fetchData.push(jsonObject);
        }

        chunk = lines[lines.length - 1];
        await read();
      };

      await read();
      setTournamentGames(fetchData);
      return fetchData;
    } catch (error) {
      console.error('Error fetching games:', error);
      throw error;
    }
  };

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['tournamentGames', tournamentType, tournamentId],
    queryFn: fetchGames,
    enabled: false,
  });

  useEffect(() => {
    if (tournamentGames.length > 0) {
      const insightsResult = calculateAllInsights(tournamentGames, Object.values(INSIGHTS));
      setCalculatedInsights(insightsResult);
    }
  }, [tournamentGames]);

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
      {isDataFetched && calculatedInsights && (
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
            tournamentData={{ name: `${tournamentType.charAt(0).toUpperCase() + tournamentType.slice(1)} Tournament`, type: tournamentType, players: calculatedInsights.totalGames }}
            insights={calculatedInsights.insights}
            analysedGames={calculatedInsights.analysedGames}
            totalGames={calculatedInsights.totalGames}
            selectedInsights={selectedInsights}
            onInsightSelection={handleInsightSelection}
          />
          <div id="selected-insights-container" className="mt-6 p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
            <h2 className="text-2xl font-bold mb-4">{tournamentType.charAt(0).toUpperCase() + tournamentType.slice(1)} Tournament Insights</h2>
            <TournamentInsights 
              tournamentData={{ name: `${tournamentType.charAt(0).toUpperCase() + tournamentType.slice(1)} Tournament`, type: tournamentType, players: calculatedInsights.totalGames }}
              insights={calculatedInsights.insights}
              analysedGames={calculatedInsights.analysedGames}
              totalGames={calculatedInsights.totalGames}
              selectedInsights={selectedInsights}
              onInsightSelection={() => {}}
              showOnlySelected={true}
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
