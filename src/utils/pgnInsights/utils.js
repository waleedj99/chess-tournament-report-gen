export const calculateMoveCount = (moves) => {
  if (!moves || moves.length === 0) return 0;
  return moves[moves.length - 1].moveNumber;
};

export const parseGameId = (annotator) => {
  if (!annotator) return null;
  const parts = annotator.split('/');
  return parts[parts.length - 1] || null;
};