import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import ChessInsightsApp from '../ChessInsightsApp';
import { useFetchGames } from '../useFetchGames';
import { useInsightsCalculation } from '../useInsightsCalculation';

jest.mock('../useFetchGames');
jest.mock('../useInsightsCalculation');

const queryClient = new QueryClient();

const wrapper = ({ children }) => (
  <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
);

describe('ChessInsightsApp', () => {
  beforeEach(() => {
    useFetchGames.mockReturnValue({
      fetchGames: jest.fn(),
      data: [],
      isLoading: false,
      error: null,
      evaluationProgress: 0,
    });
    useInsightsCalculation.mockReturnValue({
      calculatedInsights: null,
      dataProcessingProgress: 0,
      isProcessing: false,
    });
  });

  test('renders tournament type and ID inputs', () => {
    render(<ChessInsightsApp />, { wrapper });
    expect(screen.getByRole('combobox')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter tournament ID')).toBeInTheDocument();
  });

  test('fetches games when Fetch Data button is clicked', async () => {
    const mockFetchGames = jest.fn();
    useFetchGames.mockReturnValue({
      fetchGames: mockFetchGames,
      data: [],
      isLoading: false,
      error: null,
      evaluationProgress: 0,
    });

    render(<ChessInsightsApp />, { wrapper });
    
    fireEvent.change(screen.getByRole('combobox'), { target: { value: 'swiss' } });
    fireEvent.change(screen.getByPlaceholderText('Enter tournament ID'), { target: { value: '123456' } });
    fireEvent.click(screen.getByText('Fetch Data'));

    await waitFor(() => {
      expect(mockFetchGames).toHaveBeenCalledWith('swiss', '123456');
    });
  });

  test('displays loading state when fetching games', () => {
    useFetchGames.mockReturnValue({
      fetchGames: jest.fn(),
      data: [],
      isLoading: true,
      error: null,
      evaluationProgress: 50,
    });

    render(<ChessInsightsApp />, { wrapper });
    expect(screen.getByText('Loading tournament data...')).toBeInTheDocument();
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  test('displays error message when fetch fails', () => {
    useFetchGames.mockReturnValue({
      fetchGames: jest.fn(),
      data: [],
      isLoading: false,
      error: 'Failed to fetch data',
      evaluationProgress: 0,
    });

    render(<ChessInsightsApp />, { wrapper });
    expect(screen.getByText('Failed to fetch data')).toBeInTheDocument();
  });

  test('displays insights when data is fetched and processed', () => {
    useFetchGames.mockReturnValue({
      fetchGames: jest.fn(),
      data: [{ id: 1 }],
      isLoading: false,
      error: null,
      evaluationProgress: 100,
    });
    useInsightsCalculation.mockReturnValue({
      calculatedInsights: {
        insights: { SHORTEST_GAME_BY_MOVES: [{ value: 10 }] },
        analysedGames: 1,
        totalGames: 1,
      },
      dataProcessingProgress: 100,
      isProcessing: false,
    });

    render(<ChessInsightsApp />, { wrapper });
    expect(screen.getByText('Shortest Game Length By Moves')).toBeInTheDocument();
  });
});