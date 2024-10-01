import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import TournamentInsights from '../TournamentInsights';
import PngPreview from '../PngPreview';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { InfoIcon, TrendingUpIcon, ActivityIcon } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import InsightsOverview from '../InsightsOverview';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useFetchGames } from './useFetchGames';
import { useInsightsCalculation } from './useInsightsCalculation';
import TournamentWinners from '../TournamentWinners';

const ChessInsightsApp = () => {
  const [tournamentType, setTournamentType] = useState('swiss');
  const [tournamentId, setTournamentId] = useState('');
  const [selectedInsights, setSelectedInsights] = useState({});

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

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Tournament Data</CardTitle>
        </CardHeader>
        <CardContent>
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

      {isLoading && (
        <Card>
          <CardContent className="pt-6">
            <p>Loading tournament data...</p>
            <Progress value={evaluationProgress} className="w-full mt-2" />
          </CardContent>
        </Card>
      )}

      {fetchError && (
        <Alert variant="destructive">
          <AlertDescription>{fetchError}</AlertDescription>
        </Alert>
      )}

      {tournamentDetails && (
        <Card>
          <CardHeader>
            <CardTitle>{tournamentDetails.name}</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Type: {tournamentType}</p>
            <p>Number of players: {tournamentDetails.nbPlayers}</p>
            <TournamentWinners winners={tournamentDetails.podium} />
          </CardContent>
        </Card>
      )}

      {tournamentGames.length > 0 && calculatedInsights && (
        <>
          <Alert>
            <InfoIcon className="h-4 w-4" />
            <AlertDescription>
              Some insights require game analysis. This process may take some time depending on the number of games.
            </AlertDescription>
          </Alert>
          {isProcessing && (
            <Card>
              <CardContent className="pt-6">
                <p>Processing data...</p>
                <Progress value={dataProcessingProgress} className="w-full mt-2" />
              </CardContent>
            </Card>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <TrendingUpIcon className="mr-2" /> Trending Insights
                </CardTitle>
              </CardHeader>
              <CardContent>
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
                />
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <ActivityIcon className="mr-2" /> Recent Activities
                </CardTitle>
              </CardHeader>
              <CardContent>
                <InsightsOverview />
              </CardContent>
            </Card>
          </div>
          <Card>
            <CardHeader>
              <CardTitle>PNG Preview</CardTitle>
            </CardHeader>
            <CardContent>
              <PngPreview
                tournamentData={{ 
                  name: tournamentDetails?.name || `${tournamentType.charAt(0).toUpperCase() + tournamentType.slice(1)} Tournament`, 
                  type: tournamentType, 
                  players: calculatedInsights.totalGames 
                }}
                insights={calculatedInsights.insights}
                analysedGames={calculatedInsights.analysedGames}
                totalGames={calculatedInsights.totalGames}
                selectedInsights={selectedInsights}
              />
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
};

export default ChessInsightsApp;