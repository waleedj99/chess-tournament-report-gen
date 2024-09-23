import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import ChessInsightsApp from '../components/ChessInsightsApp';
import DarkModeToggle from '../components/DarkModeToggle';

const queryClient = new QueryClient();

const Index = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
        <header className="bg-primary shadow">
          <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-primary-foreground">Chess Insights App</h1>
              <p className="mt-1 text-sm text-primary-foreground/80">
                Extract valuable highlights from your chess tournament.
              </p>
            </div>
            <DarkModeToggle />
          </div>
        </header>
        <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="bg-card text-card-foreground rounded-lg shadow p-6 mb-6">
            <h2 className="text-2xl font-semibold mb-4">Welcome to Chess Insights!</h2>
            <p className="mb-4">
              This tool is designed for chess tournament organizers who want to extract highlights and insights from their events. Simply enter your tournament details, and we'll provide you with valuable information about the games played.
            </p>
            <p className="mb-4">
              Please note that some insights, such as 'Most Dynamic Game', 'Most Accurate Player', and 'Most Accurate Match', require in-depth game analysis. This process may take some time depending on the number of games in your tournament. Other insights are available immediately after entering your tournament data.
            </p>
          </div>
          <ChessInsightsApp />
        </main>
      </div>
    </QueryClientProvider>
  );
};

export default Index;
