import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const TournamentForm = ({ tournamentType, setTournamentType, tournamentId, setTournamentId, handleFetchData }) => {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Select value={tournamentType} onValueChange={setTournamentType}>
            <SelectTrigger>
              <SelectValue placeholder="Select tournament type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="swiss">Swiss</SelectItem>
              <SelectItem value="arena">Arena</SelectItem>
            </SelectContent>
          </Select>
          <Input
            type="text"
            placeholder="Enter tournament ID"
            value={tournamentId}
            onChange={(e) => setTournamentId(e.target.value)}
          />
          <Button onClick={handleFetchData}>Fetch Data</Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default TournamentForm;