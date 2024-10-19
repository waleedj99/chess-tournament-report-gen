import React from 'react';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { InfoIcon } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import InsightsOverview from '../InsightsOverview';
import TournamentInsights from '../TournamentInsights';
import TournamentForm from '../TournamentForm';
import { useFetchGames } from './useFetchGames';
import { useInsightsCalculation } from './useInsightsCalculation';
import { useInsightSelection } from './useInsightSelection';

const ChessInsightsApp = () => {
  const { 
    tournamentType, setTournamentType,
    tournamentId, setTournamentId,
    fetchGames, 
    tournamentGames, 
    isLoading, 
    fetchError, 
    evaluationProgress,
    tournamentDetails
  } = useFetchGames();

  const {
    calculatedInsights,
    dataProcessingProgress,
    isProcessing
  } = useInsightsCalculation(tournamentGames);

  const { selectedInsights, handleInsightSelection } = useInsightSelection();

  const handleFetchData = () => {
    if (tournamentId) {
      fetchGames(tournamentType, tournamentId);
    }
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