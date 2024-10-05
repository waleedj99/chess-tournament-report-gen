import React, { useState } from 'react';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { InfoIcon } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import InsightsOverview from '../InsightsOverview';
import TournamentInsights from '../TournamentInsights';
import TournamentForm from '../TournamentForm';
import PngPreview from '../PngPreview';
import { useFetchGames } from './useFetchGames';
import { useInsightsCalculation } from './useInsightsCalculation';
import { toPng } from 'html-to-image';

const ChessInsightsApp = () => {
  const [tournamentType, setTournamentType] = useState('swiss');
  const [tournamentId, setTournamentId] = useState('');
  const [selectedInsights, setSelectedInsights] = useState({});
  const [pngPreview, setPngPreview] = useState(null);

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
          <div id="selected-insights-container">
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
              showOnlySelected={true}
              isPngPreview={true}
            />
          </div>
          <button onClick={generatePng} className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors">
            Generate PNG
          </button>
          {pngPreview && <PngPreview imageUrl={pngPreview} />}
        </div>
      )}
    </div>
  );
};

export default ChessInsightsApp;