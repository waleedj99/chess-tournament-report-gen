import React from 'react';
import { Button } from '@/components/ui/button';
import { ExternalLinkIcon } from 'lucide-react';

const GameRedirectButton = ({ gameId }) => {
  return (
    <Button
      variant="ghost"
      size="sm"
      className="ml-auto"
      onClick={() => window.open(`https://lichess.org/${gameId}`, '_blank')}
    >
      Open <ExternalLinkIcon className="ml-1 h-4 w-4" />
    </Button>
  );
};

export default GameRedirectButton;