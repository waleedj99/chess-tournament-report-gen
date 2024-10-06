import React, { useState } from 'react';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { InfoIcon } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import InsightsOverview from '../InsightsOverview';
import TournamentInsights from '../TournamentInsights';
import TournamentForm from '../TournamentForm';
import { useFetchGames } from './useFetchGames';
import { useInsightsCalculation } from './useInsightsCalculation';

const ChessInsightsApp = () => {
  const [tournamentType, setTournamentType] = useState('swiss');
  const [tournamentId, setTournamentId] = useState('');
  const [selectedInsights, setSelectedInsights] = useState({"MOST_ACCURATE_GAME" : [0],
    'SHORTEST_GAME_LENGTH_BY_MOVES':[0],
    'LONGEST_GAME_LENGTH_BY_MOVES':[0],
    'LONGEST_MOVE_BY_TIME':[0],
    'MOST_DYNAMIC_GAME':[0],
    'MOST_USED_OPENING':[0],
    'MOST_ACCURATE_PLAYER':[0],
    'HIGHEST_WINNING_STREAK':[0]});

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
    <div className="space-y-6">
      <InsightsOverview />
      <TournamentForm 
        tournamentType={tournamentType}
        setTournamentType={setTournamentType}
        tournamentId={tournamentId}
        setTournamentId={setTournamentId}
        handleFetchData={handleFetchData}
      />

      {isLoading && (
        <div className="space-y-2">
          <p>Loading tournament data...</p>
          <Progress value={evaluationProgress} className="w-full" />
        </div>
      )}
      {fetchError && <Alert variant="destructive"><AlertDescription>{fetchError}</AlertDescription></Alert>}
      {tournamentGames.length > 0 && calculatedInsights && (
        <Alert>
          <InfoIcon className="h-4 w-4" />
          <AlertDescription>
            Some insights require game analysis. This process may take some time depending on the number of games.
          </AlertDescription>
        </Alert>
      )}
      {tournamentGames.length > 0 && calculatedInsights && (
        <div>
          {isProcessing && (
            <div className="space-y-2">
              <p>Processing data...</p>
              <Progress value={dataProcessingProgress} className="w-full" />
            </div>
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
        </div>
      )}
    </div>
  );
};

export default ChessInsightsApp;