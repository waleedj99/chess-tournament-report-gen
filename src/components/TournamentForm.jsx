import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const parseTournamentUrl = (url) => {
  try {
    const urlObj = new URL(url);
    const pathname = urlObj.pathname;
    
    // Swiss tournament: /swiss/{id}
    const swissMatch = pathname.match(/\/swiss\/([^/]+)/);
    if (swissMatch) {
      return { type: 'swiss', id: swissMatch[1] };
    }
    
    // Arena tournament: /tournament/{id}
    const arenaMatch = pathname.match(/\/tournament\/([^/]+)/);
    if (arenaMatch) {
      return { type: 'arena', id: arenaMatch[1] };
    }
    
    return null;
  } catch {
    return null;
  }
};

const TournamentForm = ({ setTournamentType, setTournamentId, handleFetchData }) => {
  const [tournamentUrl, setTournamentUrl] = useState('');
  const [detectedType, setDetectedType] = useState(null);

  useEffect(() => {
    const parsed = parseTournamentUrl(tournamentUrl);
    if (parsed) {
      setDetectedType(parsed.type);
      setTournamentType(parsed.type);
      setTournamentId(parsed.id);
    } else {
      setDetectedType(null);
    }
  }, [tournamentUrl, setTournamentType, setTournamentId]);

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex flex-col gap-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Input
                type="text"
                placeholder="Paste tournament URL (e.g., https://lichess.org/swiss/abc123)"
                value={tournamentUrl}
                onChange={(e) => setTournamentUrl(e.target.value)}
              />
            </div>
            <Button onClick={handleFetchData} disabled={!detectedType}>
              Fetch Data
            </Button>
          </div>
          {detectedType && (
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Detected:</span>
              <Badge variant={detectedType === 'swiss' ? 'default' : 'secondary'}>
                {detectedType === 'swiss' ? 'Swiss Tournament' : 'Arena Tournament'}
              </Badge>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default TournamentForm;