import React from 'react';
import TournamentForm from './TournamentForm';
import TournamentDataDisplay from './TournamentDataDisplay';
import InsightsOverview from './InsightsOverview';
import { useTournamentData } from '../hooks/useTournamentData';
import { useInsightSelection } from '../hooks/useInsightSelection';

const ChessInsightsApp = () => {
  const {
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
        fetchError={fetchError}
        isDataFetched={isDataFetched}
        calculatedInsights={calculatedInsights}
        evaluationProgress={evaluationProgress}
        dataProcessingProgress={dataProcessingProgress}
        selectedInsights={selectedInsights}
        onInsightSelection={handleInsightSelection}
        tournamentType={tournamentType}
      />
    </div>
  );
};

export default ChessInsightsApp;