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
  const [selectedInsights, setSelectedInsights] = useState({});
  const [expandedInsights, setExpandedInsights] = useState({});
  const [pngPreview, setPngPreview] = useState(null);
  const [tournamentGames, setTournamentGames] = useState([]);
  const [calculatedInsights, setCalculatedInsights] = useState(null);
  const [fetchError, setFetchError] = useState(null);

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
      let apiUrl;
      if (tournamentType === 'swiss') {
        apiUrl = `https://lichess.org/api/swiss/${tournamentId}/games`;
      } else if (tournamentType === 'arena') {
        apiUrl = `https://lichess.org/api/tournament/${tournamentId}/games`;
      } else {
        throw new Error('Invalid tournament type');
      }

      const response = await fetch(`${apiUrl}?evals=true&accuracy=true&clocks=true&opening=true`, requestOptions);
      
      if (!response.ok) {
        throw new Error('Failed to fetch tournament data. Please check the tournament ID and try again.');
      }

      const reader = response.body.getReader();
      let chunk = '';

      const read = async () => {
        const { done, value } = await reader.read();
        if (done) return;

        chunk += new TextDecoder().decode(value);
        const lines = chunk.split('\n');

        for (let i = 0; i < lines.length - 1; i++) {
          const jsonLine = lines[i];
          try {
            const jsonObject = JSON.parse(jsonLine);
            fetchData.push(jsonObject);
          } catch (error) {
            console.error('Error parsing JSON:', error);
          }
        }

        chunk = lines[lines.length - 1];
        await read();
      };

      await read();
      setTournamentGames(fetchData);
      setFetchError(null);
      return fetchData;
    } catch (error) {
      console.error('Error fetching games:', error);
      setFetchError(error.message);
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
      // Initialize selectedInsights with top values
      const initialSelectedInsights = {};
      Object.keys(insightsResult.insights).forEach(key => {
        if (insightsResult.insights[key] && insightsResult.insights[key].length > 0) {
          initialSelectedInsights[key] = [0]; // Select only the top value
        }
      });
      setSelectedInsights(initialSelectedInsights);
    }
  }, [tournamentGames]);

  const handleFetchData = () => {
    if (tournamentId) {
      refetch();
      setIsDataFetched(true);
    }
  };

  const handleInsightSelection = (insight) => {
    setSelectedInsights(prev => ({
      ...prev,
      [insight]: prev[insight] ? [] : [0] // Toggle selection, default to top value if selected
    }));
  };

  const handleItemSelection = (insightKey, itemIndex) => {
    setSelectedInsights(prev => {
      const currentSelection = prev[insightKey] || [];
      const updatedSelection = currentSelection.includes(itemIndex)
        ? currentSelection.filter(i => i !== itemIndex)
        : [...currentSelection, itemIndex];
      return {
        ...prev,
        [insightKey]: updatedSelection.length > 0 ? updatedSelection : [0] // Ensure at least top value is selected
      };
    });
  };

  const handleInsightExpansion = (insightKey) => {
    setExpandedInsights(prev => ({
      ...prev,
      [insightKey]: !prev[insightKey]
    }));
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
      {fetchError && <Alert variant="destructive"><AlertDescription>{fetchError}</AlertDescription></Alert>}
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
            expandedInsights={expandedInsights}
            onInsightSelection={handleInsightSelection}
            onItemSelection={handleItemSelection}
            onInsightExpansion={handleInsightExpansion}
          />
          <div id="selected-insights-container" className="mt-6 p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
            <h2 className="text-2xl font-bold mb-4">{tournamentType.charAt(0).toUpperCase() + tournamentType.slice(1)} Tournament Insights</h2>
            <TournamentInsights 
              tournamentData={{ name: `${tournamentType.charAt(0).toUpperCase() + tournamentType.slice(1)} Tournament`, type: tournamentType, players: calculatedInsights.totalGames }}
              insights={calculatedInsights.insights}
              analysedGames={calculatedInsights.analysedGames}
              totalGames={calculatedInsights.totalGames}
              selectedInsights={selectedInsights}
              expandedInsights={expandedInsights}
              onInsightSelection={() => {}}
              onItemSelection={() => {}}
              onInsightExpansion={() => {}}
              showOnlySelected={true}
              isPngPreview={true}
            />
          </div>
        </div>
      )}

      {isDataFetched && calculatedInsights && (
        <Card>
          <CardContent className="pt-6">
            <Button onClick={generatePng} disabled={Object.values(selectedInsights).every(arr => arr.length === 0)}>
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
