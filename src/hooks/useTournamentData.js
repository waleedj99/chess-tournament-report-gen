import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import calculateAllInsights from '../utils/insightsCalculator';
import { INSIGHTS } from '../utils/constants';

export const useTournamentData = () => {
  const [tournamentType, setTournamentType] = useState('swiss');
  const [tournamentId, setTournamentId] = useState('');
  const [isDataFetched, setIsDataFetched] = useState(false);
  const [tournamentGames, setTournamentGames] = useState([]);
  const [calculatedInsights, setCalculatedInsights] = useState(null);
  const [fetchError, setFetchError] = useState(null);
  const [evaluationProgress, setEvaluationProgress] = useState(0);
  const [dataProcessingProgress, setDataProcessingProgress] = useState(0);

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
      return fetchData;
    } catch (error) {
      console.error('Error fetching games:', error);
      setFetchError(error.message);
      throw error;
    }
  };

  const { isLoading, refetch } = useQuery({
    queryKey: ['tournamentGames', tournamentType, tournamentId],
    queryFn: fetchGames,
    enabled: false,
    onSuccess: (data) => {
      setTournamentGames(data);
      processInsights(data);
    },
    onError: (error) => {
      setFetchError(error.message);
    },
  });

  const processInsights = async (games) => {
    setDataProcessingProgress(0);
    const insightsResult = await calculateAllInsights(games, Object.values(INSIGHTS), (progress) => {
      setDataProcessingProgress(progress);
    });
    setCalculatedInsights(insightsResult);
  };

  const handleFetchData = () => {
    if (tournamentId) {
      refetch();
      setIsDataFetched(true);
      setEvaluationProgress(0);
      const interval = setInterval(() => {
        setEvaluationProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            return 100;
          }
          return prev + 1;
        });
      }, 100);
    }
  };

  return {
    tournamentType,
    setTournamentType,
    tournamentId,
    setTournamentId,
    isLoading,
    fetchError,
    isDataFetched,
    calculatedInsights,
    evaluationProgress,
    dataProcessingProgress,
    handleFetchData,
  };
};
