import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import TournamentInsights from './TournamentInsights';
import PngPreview from './PngPreview';
import { toPng } from 'html-to-image';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { InfoIcon } from 'lucide-react';
import InsightsOverview from './InsightsOverview';

const fetchTournamentData = async ({ tournamentType, tournamentId }) => {
  // Simulating API call with dummy data
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        id: tournamentId,
        type: tournamentType,
        name: "Chess Masters 2023",
        players: 64,
        games: 124,
        analyzedGames: 50,
      });
    }, 1000);
  });
};

const layoutOptions = [
  { id: 'classic', name: 'Classic', background: 'bg-gray-100' },
  { id: 'modern', name: 'Modern', background: 'bg-blue-100' },
  { id: 'dark', name: 'Dark', background: 'bg-gray-800 text-white' },
];

const ChessInsightsApp = () => {
  const [tournamentType, setTournamentType] = useState('swiss');
  const [tournamentId, setTournamentId] = useState('');
  const [isDataFetched, setIsDataFetched] = useState(false);
  const [selectedInsights, setSelectedInsights] = useState([]);
  const [selectedNextBest, setSelectedNextBest] = useState({});
  const [pngPreview, setPngPreview] = useState(null);
  const [selectedLayout, setSelectedLayout] = useState(layoutOptions[0]);
  const [showAnalysisAlert, setShowAnalysisAlert] = useState(false);

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['tournamentData', tournamentType, tournamentId],
    queryFn: () => fetchTournamentData({ tournamentType, tournamentId }),
    enabled: false,
  });

  const handleFetchData = () => {
    if (tournamentId) {
      refetch();
      setIsDataFetched(true);
      setShowAnalysisAlert(true);
    }
  };

  const handleInsightSelection = (insight) => {
    setSelectedInsights(prev => 
      prev.includes(insight) 
        ? prev.filter(i => i !== insight)
        : [...prev, insight]
    );
  };

  const handleNextBestSelection = (key, index) => {
    setSelectedNextBest(prev => {
      const currentSelection = prev[key] || [];
      return {
        ...prev,
        [key]: currentSelection.includes(index)
          ? currentSelection.filter(i => i !== index)
          : [...currentSelection, index]
      };
    });
  };

  const generatePng = async () => {
    const element = document.getElementById('selected-insights-container');
    if (element) {
      const dataUrl = await toPng(element, {
        width: 800,
        height: 800,
        style: {
          transform: 'scale(2)',
          transformOrigin: 'top left',
          width: '400px',
          height: '400px'
        }
      });
      setPngPreview(dataUrl);
    }
  };

  return (
    <div className="space-y-6">
      <InsightsOverview />
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

      {isLoading && <p>Loading tournament data...</p>}
      {error && <p className="text-red-500">Error: {error.message}</p>}
      {showAnalysisAlert && (
        <Alert>
          <InfoIcon className="h-4 w-4" />
          <AlertTitle>Game Analysis Required</AlertTitle>
          <AlertDescription>
            Some insights like 'Most Dynamic Game', 'Most Accurate Player', and 'Most Accurate Match' require game analysis. This process may take some time depending on the number of games in the tournament.
          </AlertDescription>
        </Alert>
      )}
      {isDataFetched && data && (
        <div>
          <TournamentInsights 
            tournamentData={data} 
            selectedInsights={selectedInsights}
            onInsightSelection={handleInsightSelection}
            selectedNextBest={selectedNextBest}
            onNextBestSelection={handleNextBestSelection}
          />
          <div id="selected-insights-container" className={`mt-6 p-4 rounded-lg shadow ${selectedLayout.background}`}>
            <h2 className="text-2xl font-bold mb-4">{data.name} Insights</h2>
            <TournamentInsights 
              tournamentData={data} 
              selectedInsights={selectedInsights}
              onInsightSelection={() => {}}
              showOnlySelected={true}
              selectedNextBest={selectedNextBest}
              onNextBestSelection={() => {}}
              isPngPreview={true}
            />
          </div>
        </div>
      )}

      {isDataFetched && data && (
        <div className="space-y-4">
          <Select value={selectedLayout.id} onValueChange={(layoutId) => setSelectedLayout(layoutOptions.find(l => l.id === layoutId))}>
            <SelectTrigger>
              <SelectValue placeholder="Select layout" />
            </SelectTrigger>
            <SelectContent>
              {layoutOptions.map((layout) => (
                <SelectItem key={layout.id} value={layout.id}>{layout.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button onClick={generatePng} disabled={selectedInsights.length === 0}>
            Generate PNG
          </Button>
          {pngPreview && <PngPreview imageUrl={pngPreview} layout={selectedLayout} />}
        </div>
      )}
    </div>
  );
};

export default ChessInsightsApp;
