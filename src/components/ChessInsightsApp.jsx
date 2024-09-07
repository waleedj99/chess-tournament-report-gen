import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import TournamentInsights from './TournamentInsights';
import PngPreview from './PngPreview';
import { toPng } from 'html-to-image';

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
        // Add more dummy data as needed
      });
    }, 1000);
  });
};

const ChessInsightsApp = () => {
  const [tournamentType, setTournamentType] = useState('swiss');
  const [tournamentId, setTournamentId] = useState('');
  const [isDataFetched, setIsDataFetched] = useState(false);
  const [selectedInsights, setSelectedInsights] = useState([]);
  const [pngPreview, setPngPreview] = useState(null);

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['tournamentData', tournamentType, tournamentId],
    queryFn: () => fetchTournamentData({ tournamentType, tournamentId }),
    enabled: false,
  });

  const handleFetchData = () => {
    if (tournamentId) {
      refetch();
      setIsDataFetched(true);
    }
  };

  const handleInsightSelection = (insight) => {
    setSelectedInsights(prev => 
      prev.includes(insight) 
        ? prev.filter(i => i !== insight)
        : [...prev, insight]
    );
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
      {isDataFetched && data && (
        <div>
          <TournamentInsights 
            tournamentData={data} 
            selectedInsights={selectedInsights}
            onInsightSelection={handleInsightSelection}
          />
          <div id="selected-insights-container" className="mt-6 p-4 bg-white rounded-lg shadow">
            <h2 className="text-2xl font-bold mb-4">{data.name} Insights</h2>
            <TournamentInsights 
              tournamentData={data} 
              selectedInsights={selectedInsights}
              onInsightSelection={() => {}}
              showOnlySelected={true}
            />
          </div>
        </div>
      )}

      {isDataFetched && data && (
        <div className="space-y-4">
          <Button onClick={generatePng} disabled={selectedInsights.length === 0}>
            Generate PNG
          </Button>
          {pngPreview && <PngPreview imageUrl={pngPreview} />}
        </div>
      )}
    </div>
  );
};

export default ChessInsightsApp;