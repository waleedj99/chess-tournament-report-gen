import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const PngPreview = ({ imageUrl }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>PNG Preview</CardTitle>
      </CardHeader>
      <CardContent>
        <img src={imageUrl} alt="Insights Preview" className="w-full h-auto" />
        <div className="mt-4 flex justify-center space-x-4">
          <a href={imageUrl} download="chess-insights.png" className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors">
            Download PNG
          </a>
          <button onClick={() => window.open(imageUrl)} className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors">
            Open in New Tab
          </button>
        </div>
      </CardContent>
    </Card>
  );
};

export default PngPreview;