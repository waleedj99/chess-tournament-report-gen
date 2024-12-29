import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import TournamentInsights from './TournamentInsights';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { InfoIcon } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import InsightsOverview from './InsightsOverview';
import calculateAllInsights from '../utils/insightsCalculator';
import calculatePGNInsights from '../utils/pgnInsightsCalculator';
import { INSIGHTS } from '../utils/constants';
import { Progress } from '@/components/ui/progress';
import { parse } from '@mliebelt/pgn-parser';

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
  const [tournamentInfo, setTournamentInfo] = useState();

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
      setTournamentInfo(data)
      setFetchError(null);
      return fetchData;
    } catch (error) {
      console.error('Error fetching games:', error);
      setFetchError(error.message);
      throw error;
    }
  };

  const fetchPGNGames = async () => {
    var requestOptions = {
      method: 'GET',
      redirect: 'follow',
    };

    try {
      const apiUrl = `https://lichess.org/broadcast/fide-world-rapid--blitz-championships-2024--rapid-open-1-30/round-9/dTW0DV3y.pgn`;
      const response = await fetch(apiUrl, requestOptions);
      
      if (!response.ok) {
        throw new Error('Failed to fetch PGN data');
      }
      
      const data = await response.text();
      const parsedGame = parse(data);
      console.log("Parsed PGN game:", parsedGame);
      
      const pgnInsights = calculatePGNInsights(parsedGame);
      setCalculatedInsights(pgnInsights);
      setIsDataFetched(true);
      
      let map = {};
      Object.keys(INSIGHTS).forEach(key => {
        map[key] = [0];
      });
      setSelectedInsights(map);
      
      return parsedGame;
    } catch (error) {
      console.error('Error fetching PGN games:', error);
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
      if (tournamentType === 'pgn') {
        fetchPGNGames();
      } else {
        fetchTournamentDetails();
        refetch();
      }
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
                <SelectItem value="pgn">PGN Game</SelectItem>
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
        </div>
      )}
    </div>
  );
};

export default ChessInsightsApp;
