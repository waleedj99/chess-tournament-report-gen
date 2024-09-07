import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Share2Icon } from 'lucide-react';

const PngPreview = ({ imageUrl, layout }) => {
  const shareToSocialMedia = (platform) => {
    // Implement sharing logic for different platforms
    console.log(`Sharing to ${platform}`);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>PNG Preview ({layout.name} Layout)</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className={`p-4 rounded-lg ${layout.background}`}>
          <img src={imageUrl} alt="Insights Preview" className="w-full h-auto" />
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
          <a href={imageUrl} download="chess-insights.png" className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors">
            Download PNG
          </a>
        </div>
      </CardContent>
    </Card>
  );
};

export default PngPreview;