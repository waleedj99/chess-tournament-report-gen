import { useState, useEffect } from 'react';
import calculateAllInsights from '../../utils/insightsCalculator';
import { INSIGHTS } from '../../utils/constants';

export const useInsightsCalculation = (tournamentGames) => {
  const [calculatedInsights, setCalculatedInsights] = useState(null);
  const [dataProcessingProgress, setDataProcessingProgress] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (tournamentGames.length > 0) {
      setIsProcessing(true);
      setDataProcessingProgress(0);
      const processInsights = async () => {
        const insightsResult = await calculateAllInsights(tournamentGames, Object.values(INSIGHTS), (progress) => {
          setDataProcessingProgress(progress);
        });
        setCalculatedInsights(insightsResult);
        setIsProcessing(false);
      };
      processInsights();
    }
  }, [tournamentGames]);

  return { calculatedInsights, dataProcessingProgress, isProcessing };
};