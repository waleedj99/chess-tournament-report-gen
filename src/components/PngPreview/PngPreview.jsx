import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Share2Icon } from 'lucide-react';
import { toPng } from 'html-to-image';
import TournamentInsights from '../TournamentInsights';

const PngPreview = ({ tournamentData, insights, analysedGames, totalGames, selectedInsights }) => {
  const [pngPreview, setPngPreview] = useState(null);

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

  const shareToSocialMedia = (platform) => {
    // Implement sharing logic for different platforms
    console.log(`Sharing to ${platform}`);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>PNG Preview</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div id="selected-insights-container" className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
          <h2 className="text-2xl font-bold mb-4">{tournamentData.name} Insights</h2>
          <TournamentInsights 
            tournamentData={tournamentData}
            insights={insights}
            analysedGames={analysedGames}
            totalGames={totalGames}
            selectedInsights={selectedInsights}
            showOnlySelected={true}
            isPngPreview={true}
          />
        </div>
        <Button onClick={generatePng} disabled={Object.values(selectedInsights).every(arr => arr.length === 0)}>
          Generate PNG
        </Button>
        {pngPreview && (
          <>
            <div className="p-4 rounded-lg bg-gray-100">
              <img src={pngPreview} alt="Insights Preview" className="w-full h-auto" />
            </div>
            <div className="flex flex-wrap justify-center gap-2">
              <Button onClick={() => shareToSocialMedia('twitter')} className="bg-blue-400 hover:bg-blue-500">
                <Share2Icon className="mr-2 h-4 w-4" /> Twitter
              </Button>
              <Button onClick={() => shareToSocialMedia('facebook')} className="bg-blue-600 hover:bg-blue-700">
                <Share2Icon className="mr-2 h-4 w-4" /> Facebook
              </Button>
              <Button onClick={() => shareToSocialMedia('linkedin')} className="bg-blue-700 hover:bg-blue-800">
                <Share2Icon className="mr-2 h-4 w-4" /> LinkedIn
              </Button>
            </div>
            <div className="flex justify-center">
              <a href={pngPreview} download="chess-insights.png" className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors">
                Download PNG
              </a>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default PngPreview;