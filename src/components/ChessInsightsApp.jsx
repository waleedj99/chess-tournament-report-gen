import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';


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
  const [roundsUrl, setRoundsUrl] = useState([])
  const [totalGames, setTotalGames] = useState([])
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
      let tdetails = await fetch("https://lichess.org/api/broadcast/zsiKgSQq", requestOptions)
        .then(res => res.json());

      setRoundsUrl(tdetails.rounds.map(r => r.url));
      setTotalGames([]);

      const roundsUrl = tdetails.rounds.map(r => r.url); // Get rounds URLs after setting state

      // Create an array of promises to handle all round fetches
      const gamePromises = roundsUrl.map(async (round) => {
        try {
          console.log(round);
          const response = await fetch(round + ".pgn", requestOptions);

          if (!response.ok) {
            throw new Error('Failed to fetch PGN data');
          }

          const data = await response.text();
          console.log("Setting Round " + round);

          // Collect the parsed games
          return parse(data); // We will accumulate parsed games here
        } catch (error) {
          console.error("Error fetching PGN data for round " + round, error);
          return [];
        }
      });

      // Wait for all fetches and parsing to complete
      const parsedGames = await Promise.all(gamePromises);

      // Update the state with all the parsed games
      const allGames = parsedGames.flat(); // Flatten the array of games

      // Update totalGames state once all data is fetched
      setTotalGames(allGames);

      console.log("Parsed PGN game:", allGames);

      // Calculate insights
      const pgnInsights = calculatePGNInsights(allGames);
      setCalculatedInsights(pgnInsights);

      // Indicate data fetch is complete
      setIsDataFetched(true);

      // Prepare the insights map
      let map = {};
      Object.keys(INSIGHTS).forEach(key => {
        map[key] = [0];
      });
      setSelectedInsights(map);

      return allGames;
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
    <div className="space-y-4">
      <InsightsOverview
        tournamentId={tournamentId}
        setTournamentId={setTournamentId}
        setTournamentType={setTournamentType}
        handleFetchData={handleFetchData}
      />

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
            tournamentData={{ name: tournamentInfo?.fullName, type: tournamentType, players: tournamentInfo?.nbPlayers }}
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
