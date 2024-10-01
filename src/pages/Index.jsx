import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import ChessInsightsApp from '../components/ChessInsightsApp';
import Layout from '../components/Layout';
import { ThemeProvider } from '../components/ThemeProvider';

const queryClient = new QueryClient();

const Index = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <Layout>
          <ChessInsightsApp />
        </Layout>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default Index;