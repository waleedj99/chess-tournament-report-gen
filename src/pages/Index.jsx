import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import ChessInsightsApp from '../components/ChessInsightsApp';
import { ChessIcon } from 'lucide-react';

const queryClient = new QueryClient();

const Index = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen bg-gray-100">
        <header className="bg-white shadow">
          <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
            <div className="flex items-center space-x-4">
              <ChessIcon className="h-12 w-12 text-blue-600" />
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Chess Insights App</h1>
                <p className="mt-1 text-sm text-gray-600">
                  Extract valuable highlights from your chess tournament. Analyze games, track performance, and showcase the most exciting moments.
                </p>
              </div>
            </div>
          </div>
        </header>
        <main>
          <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
            <p className="mb-4 text-gray-700">
              Welcome to the Chess Insights App! This tool is designed for chess tournament organizers who want to extract highlights and insights from their events. Simply enter your tournament details, and we'll provide you with valuable information about the games played.
            </p>
            <p className="mb-4 text-gray-700">
              Please note that some insights, such as 'Most Dynamic Game', 'Most Accurate Player', and 'Most Accurate Match', require in-depth game analysis. This process may take some time depending on the number of games in your tournament. Other insights are available immediately after entering your tournament data.
            </p>
            <ChessInsightsApp />
          </div>
        </main>
      </div>
    </QueryClientProvider>
  );
};

export default Index;
