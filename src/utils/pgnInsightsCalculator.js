import { calculateMoveInsights } from './pgnInsights/moveInsights';
import { calculatePlayerInsights } from './pgnInsights/playerInsights';
import { calculateOpeningInsights } from './pgnInsights/openingInsights';
import { calculateGameTerminationInsights } from './pgnInsights/gameTerminationInsights';

const calculatePGNInsights = (pgnGames) => {
  console.log("Calculating insights for PGN games:", pgnGames);
  
  const insights = {
    ...calculateMoveInsights(pgnGames),
    ...calculatePlayerInsights(pgnGames),
    ...calculateOpeningInsights(pgnGames),
    ...calculateGameTerminationInsights(pgnGames)
  };

  return {
    insights,
    analysedGames: pgnGames.length,
    totalGames: pgnGames.length
  };
};

export default calculatePGNInsights;