export const calculateMoveCount = (moves) => {
  return moves ? Math.floor(moves.length / 2) : 0;
};

export const parseGameId = (annotator) => {
  if (!annotator) return null;
  const parts = annotator.split('/');
  return parts[parts.length - 1] || null;
};