import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';

export const useFetchGames = () => {
  const [tournamentType, setTournamentType] = useState('swiss');
  const [tournamentId, setTournamentId] = useState('');
  const [tournamentGames, setTournamentGames] = useState([]);
  const [evaluationProgress, setEvaluationProgress] = useState(0);
  const [tournamentDetails, setTournamentDetails] = useState(null);

  const fetchGames = async (type, id) => {
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
      // Fetch tournament details
      const detailsResponse = await fetch(`https://lichess.org/api/${type}/${id}`, requestOptions);
      if (!detailsResponse.ok) {
        throw new Error('Failed to fetch tournament details');
      }
      const details = await detailsResponse.json();
      setTournamentDetails(details);

      // Fetch games
      let apiUrl = `https://lichess.org/api/${type === 'swiss' ? 'swiss' : 'tournament'}/${id}/games`;
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
          try {
            const jsonObject = JSON.parse(lines[i]);
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
    queryKey: ['tournamentGames', tournamentType, tournamentId],
    queryFn: () => fetchGames(tournamentType, tournamentId),
    enabled: false,
  });

  return { 
    tournamentType,
    setTournamentType,
    tournamentId,
    setTournamentId,
    fetchGames: refetch, 
    tournamentGames, 
    isLoading, 
    fetchError: error, 
    evaluationProgress,
    tournamentDetails
  };
};