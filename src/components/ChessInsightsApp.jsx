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
import { Progress } from '@/components/ui/progress';

const ChessInsightsApp = () => {
  const [tournamentType, setTournamentType] = useState('swiss');
  const [tournamentId, setTournamentId] = useState('');
  const [isDataFetched, setIsDataFetched] = useState(false);
  const [selectedInsights, setSelectedInsights] = useState({});
  const [pngPreview, setPngPreview] = useState(null);
  const [tournamentGames, setTournamentGames] = useState([]);
  const [calculatedInsights, setCalculatedInsights] = useState(null);
  const [fetchError, setFetchError] = useState(null);
  const [evaluationProgress, setEvaluationProgress] = useState(0);
  const [dataProcessingProgress, setDataProcessingProgress] = useState(0);
  const [tournamentInfo, setTournamentInfo] = useState()

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

  const fetchTournamentDetails = async () => {
    let fetchData = [];
    var requestOptions = {
      method: 'GET',
      redirect: 'follow',
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
    };

    try {
      let apiUrl;
      if (tournamentType === 'swiss') {
        apiUrl = `https://lichess.org/api/swiss/${tournamentId}`;
      } else if (tournamentType === 'arena') {
        apiUrl = `https://lichess.org/api/tournament/${tournamentId}`;
      } else {
        throw new Error('Invalid tournament type');
      }

      const response = await fetch(`${apiUrl}`, requestOptions);
      const data = await response.json();

      if (!response.ok) {
        throw new Error('Failed to fetch tournament data. Please check the tournament ID and try again.');
      }
      console.log(data)
      setTournamentInfo(data)
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
      setDataProcessingProgress(0);
      const processInsights = async () => {
        const insightsResult = await calculateAllInsights(tournamentGames, Object.values(INSIGHTS), (progress) => {
          setDataProcessingProgress(progress);
        });
        setCalculatedInsights(insightsResult);
        let map = {}
        Object.keys(INSIGHTS).forEach(key => {
          map[key] = [0]
        })
        setSelectedInsights(map);
      };
      processInsights();
    }
  }, [tournamentGames]);

  const handleFetchData = () => {
    if (tournamentId) {
      fetchTournamentDetails()
      refetch();
      setIsDataFetched(true);
      setEvaluationProgress(0);
      const interval = setInterval(() => {
        setEvaluationProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            return 100;
          }
          return prev + 1;
        });
      }, 100);
    }
  };

  const handleInsightSelection = (insightKey, itemIndex) => {
    setSelectedInsights(prev => ({
      ...prev,
      [insightKey]: prev[insightKey]?.includes(itemIndex)
        ? prev[insightKey].filter(i => i !== itemIndex)
        : [...(prev[insightKey] || []), itemIndex]
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

      {isLoading && (
        <div className="space-y-2">
          <p>Loading tournament data...</p>
          <Progress value={evaluationProgress} className="w-full" />
        </div>
      )}
      {fetchError && <Alert variant="destructive"><AlertDescription>{fetchError}</AlertDescription></Alert>}
      {/* {isDataFetched && calculatedInsights && (
        <Alert>
          <InfoIcon className="h-4 w-4" />
          <AlertDescription>
            Some insights require game analysis. This process may take some time depending on the number of games.
          </AlertDescription>
        </Alert>
      )} */}
      {isDataFetched && calculatedInsights && (
        <div>
          <TournamentInsights 
            tournamentData={{ name: tournamentInfo?.fullName , type: tournamentType, players: tournamentInfo?.nbPlayers }}
            insights={calculatedInsights.insights}
            analysedGames={calculatedInsights.analysedGames}
            totalGames={calculatedInsights.totalGames}
            selectedInsights={selectedInsights}
            onInsightSelection={handleInsightSelection}
          />
          {/* <div id="selected-insights-container" className="mt-6 p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
            <h2 className="text-2xl font-bold mb-4">{tournamentType.charAt(0).toUpperCase() + tournamentType.slice(1)} Tournament Insights</h2>
            <TournamentInsights 
              tournamentData={{ name: `${tournamentType.charAt(0).toUpperCase() + tournamentType.slice(1)} Tournament`, type: tournamentType, players: calculatedInsights.totalGames }}
              insights={calculatedInsights.insights}
              analysedGames={calculatedInsights.analysedGames}
              totalGames={calculatedInsights.totalGames}
              selectedInsights={selectedInsights}
              showOnlySelected={true}
              isPngPreview={true}
            />
          </div> */}
        </div>
      )}

      {/* {isDataFetched && calculatedInsights && (
        <Card>
          <CardContent className="pt-6">
            <Button onClick={generatePng} disabled={Object.values(selectedInsights).every(arr => arr.length === 0)}>
              Generate PNG
            </Button>
            {pngPreview && <PngPreview imageUrl={pngPreview} />}
          </CardContent>
        </Card>
      )} */}
    </div>
  );
};

export default ChessInsightsApp;
