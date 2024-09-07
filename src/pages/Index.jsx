import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import ChessInsightsApp from '../components/ChessInsightsApp';

const queryClient = new QueryClient();

const Index = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen bg-gray-100">
        <header className="bg-white shadow">
          <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold text-gray-900">Chess Insights App</h1>
          </div>
        </header>
        <main>
          <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
            <ChessInsightsApp />
          </div>
        </main>
      </div>
    </QueryClientProvider>
  );
};

export default Index;