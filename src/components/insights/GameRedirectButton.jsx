import React from 'react';
import { Button } from '@/components/ui/button';
import { ExternalLinkIcon } from 'lucide-react';

const GameRedirectButton = ({ gameId, annotator }) => {
  const handleRedirect = () => {
    // If annotator URL is available, use it; otherwise, fall back to lichess URL
    const redirectUrl = annotator || `https://lichess.org/${gameId}`;
    window.open(redirectUrl, '_blank');
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      className="ml-auto"
      onClick={handleRedirect}
    >
      Open <ExternalLinkIcon className="ml-1 h-4 w-4" />
    </Button>
  );
};

export default GameRedirectButton;