import React from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { InfoIcon } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import TournamentInsights from './TournamentInsights';

const TournamentDataDisplay = ({
  isLoading,
  fetchError,
  isDataFetched,
  calculatedInsights,
  evaluationProgress,
  dataProcessingProgress,
  selectedInsights,
  onInsightSelection,
  tournamentType,
}) => {
  return (
    <>
      {isLoading && (
        <div className="space-y-2">
          <p>Loading tournament data...</p>
          <Progress value={evaluationProgress} className="w-full" />
        </div>
      )}
      {fetchError && (
        <Alert variant="destructive">
          <AlertDescription>{fetchError}</AlertDescription>
        </Alert>
      )}
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
          {dataProcessingProgress < 100 && (
            <div className="space-y-2">
              <p>Processing data...</p>
              <Progress value={dataProcessingProgress} className="w-full" />
            </div>
          )}
          <TournamentInsights
            tournamentData={{
              name: `${tournamentType.charAt(0).toUpperCase() + tournamentType.slice(1)} Tournament`,
              type: tournamentType,
              players: calculatedInsights.totalGames,
            }}
            insights={calculatedInsights.insights}
            analysedGames={calculatedInsights.analysedGames}
            totalGames={calculatedInsights.totalGames}
            selectedInsights={selectedInsights}
            onInsightSelection={onInsightSelection}
          />
        </div>
      )}
    </>
  );
};

export default TournamentDataDisplay;