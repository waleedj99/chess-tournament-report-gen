import React from 'react';
import TournamentForm from './TournamentForm';
import TournamentDataDisplay from './TournamentDataDisplay';
import { useTournamentData } from '../hooks/useTournamentData';
import { useInsightSelection } from '../hooks/useInsightSelection';
import InsightsOverview from './InsightsOverview';

const ChessInsightsApp = () => {
  const {
    tournamentType,
    setTournamentType,
    tournamentId,
    setTournamentId,
    isDataFetched,
    tournamentGames,
    calculatedInsights,
    fetchError,
    isLoading,
    evaluationProgress,
    dataProcessingProgress,
    handleFetchData,
  } = useTournamentData();

  const { selectedInsights, handleInsightSelection } = useInsightSelection();

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
      <TournamentDataDisplay
        isLoading={isLoading}
        evaluationProgress={evaluationProgress}
        fetchError={fetchError}
        isDataFetched={isDataFetched}
        calculatedInsights={calculatedInsights}
        dataProcessingProgress={dataProcessingProgress}
        tournamentType={tournamentType}
        selectedInsights={selectedInsights}
        onInsightSelection={handleInsightSelection}
      />
    </div>
  );
};

export default ChessInsightsApp;