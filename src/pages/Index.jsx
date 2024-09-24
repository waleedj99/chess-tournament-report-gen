import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import ChessInsightsApp from '../components/ChessInsightsApp';
import DarkModeToggle from '../components/DarkModeToggle';
import { ThemeProvider } from '../components/ThemeProvider';

const queryClient = new QueryClient();

const Index = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-300">
          <header className="bg-white dark:bg-gray-800 shadow-sm">
            <div className="max-w-5xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
              <h1 className="text-2xl font-semibold">Chess Insights</h1>
              <DarkModeToggle />
            </div>
          </header>
          <main className="max-w-5xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
            <ChessInsightsApp />
          </main>
        </div>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default Index;
