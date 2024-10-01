import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const TournamentWinners = ({ winners }) => {
  const getOrdinal = (n) => {
    const s = ['th', 'st', 'nd', 'rd'];
    const v = n % 100;
    return n + (s[(v - 20) % 10] || s[v] || s[0]);
  };

  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle>Tournament Winners</CardTitle>
      </CardHeader>
      <CardContent>
        {winners && winners.map((winner, index) => (
          <div key={winner.id} className="mb-4">
            <h3 className="text-lg font-semibold">{getOrdinal(index + 1)} Place</h3>
            <p>
              <a 
                href={`https://lichess.org/@/${winner.name}`} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-500 hover:underline"
              >
                {winner.name}
              </a>
            </p>
            <p>Score: {winner.score}</p>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default TournamentWinners;