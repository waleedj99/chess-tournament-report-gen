import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';

export const useFetchGames = () => {
  const [tournamentGames, setTournamentGames] = useState([]);
  const [evaluationProgress, setEvaluationProgress] = useState(0);

  const fetchGames = async (tournamentType, tournamentId) => {
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
        setEvaluationProgress(prev => Math.min(prev + 10, 100));
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

  const { isLoading, error, refetch } = useQuery({
    queryKey: ['tournamentGames'],
    queryFn: () => fetchGames,
    enabled: false,
  });

  return { fetchGames: refetch, data: tournamentGames, isLoading, error, evaluationProgress };
};