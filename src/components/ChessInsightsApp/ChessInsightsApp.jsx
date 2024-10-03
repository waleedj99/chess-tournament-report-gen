import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import TournamentInsights from '../TournamentInsights';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { InfoIcon } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import InsightsOverview from '../InsightsOverview';
import { Container, Header, ProgressContainer, InsightsContainer } from './styles';
import { useFetchGames } from './useFetchGames';
import { useInsightsCalculation } from './useInsightsCalculation';
import TournamentWinners from '../TournamentWinners';

const ChessInsightsApp = () => {
  const [tournamentType, setTournamentType] = useState('swiss');
  const [tournamentId, setTournamentId] = useState('');
  const [selectedInsights, setSelectedInsights] = useState({});

  const { 
    fetchGames, 
    data: tournamentGames, 
    isLoading, 
    error: fetchError, 
    evaluationProgress,
    tournamentDetails
  } = useFetchGames();

  const {
    calculatedInsights,
    dataProcessingProgress,
    isProcessing
  } = useInsightsCalculation(tournamentGames);

  const handleFetchData = () => {
    if (tournamentId) {
      fetchGames(tournamentType, tournamentId);
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

  return (
    <Container>
      <InsightsOverview />
      <Header>Tournament Data</Header>
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

      {isLoading && (
        <ProgressContainer>
          <p>Loading tournament data...</p>
          <Progress value={evaluationProgress} className="w-full" />
        </ProgressContainer>
      )}

      {fetchError && <Alert variant="destructive"><AlertDescription>{fetchError}</AlertDescription></Alert>}

      {tournamentDetails && (
        <div className="mt-6">
          <h2 className="text-2xl font-bold mb-4">{tournamentDetails.name}</h2>
          <p>Type: {tournamentType}</p>
          <p>Number of players: {tournamentDetails.nbPlayers}</p>
          <TournamentWinners winners={tournamentDetails.podium} />
        </div>
      )}

      {tournamentGames.length > 0 && calculatedInsights && (
        <InsightsContainer>
          <Alert>
            <InfoIcon className="h-4 w-4" />
            <AlertDescription>
              Some insights require game analysis. This process may take some time depending on the number of games.
            </AlertDescription>
          </Alert>
          {isProcessing && (
            <ProgressContainer>
              <p>Processing data...</p>
              <Progress value={dataProcessingProgress} className="w-full" />
            </ProgressContainer>
          )}
          <TournamentInsights 
            tournamentData={{ 
              name: tournamentDetails?.name || `${tournamentType.charAt(0).toUpperCase() + tournamentType.slice(1)} Tournament`, 
              type: tournamentType, 
              players: calculatedInsights.totalGames 
            }}
            insights={calculatedInsights.insights}
            analysedGames={calculatedInsights.analysedGames}
            totalGames={calculatedInsights.totalGames}
            selectedInsights={selectedInsights}
            onInsightSelection={handleInsightSelection}
          />
        </InsightsContainer>
      )}
    </Container>
  );
};

export default ChessInsightsApp;