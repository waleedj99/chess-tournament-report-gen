import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import PngPreview from '../PngPreview';

jest.mock('html-to-image', () => ({
  toPng: jest.fn(() => Promise.resolve('data:image/png;base64,fakeImageData')),
}));

const mockTournamentData = {
  name: 'Test Tournament',
  type: 'swiss',
  players: 10,
};

const mockInsights = {
  SHORTEST_GAME_LENGTH_BY_MOVES: [{ value: 10 }],
};

const mockSelectedInsights = {
  SHORTEST_GAME_LENGTH_BY_MOVES: [0],
};

describe('PngPreview', () => {
  test('renders PNG Preview title', () => {
    render(
      <PngPreview
        tournamentData={mockTournamentData}
        insights={mockInsights}
        analysedGames={5}
        totalGames={10}
        selectedInsights={mockSelectedInsights}
      />
    );
    expect(screen.getByText('PNG Preview')).toBeInTheDocument();
  });

  test('generates PNG when button is clicked', async () => {
    render(
      <PngPreview
        tournamentData={mockTournamentData}
        insights={mockInsights}
        analysedGames={5}
        totalGames={10}
        selectedInsights={mockSelectedInsights}
      />
    );
    
    fireEvent.click(screen.getByText('Generate PNG'));
    
    await screen.findByAltText('Insights Preview');
    expect(screen.getByAltText('Insights Preview')).toBeInTheDocument();
  });

  test('displays social media sharing buttons after PNG generation', async () => {
    render(
      <PngPreview
        tournamentData={mockTournamentData}
        insights={mockInsights}
        analysedGames={5}
        totalGames={10}
        selectedInsights={mockSelectedInsights}
      />
    );
    
    fireEvent.click(screen.getByText('Generate PNG'));
    
    await screen.findByText('Twitter');
    expect(screen.getByText('Twitter')).toBeInTheDocument();
    expect(screen.getByText('Facebook')).toBeInTheDocument();
    expect(screen.getByText('LinkedIn')).toBeInTheDocument();
  });

  test('provides download link for generated PNG', async () => {
    render(
      <PngPreview
        tournamentData={mockTournamentData}
        insights={mockInsights}
        analysedGames={5}
        totalGames={10}
        selectedInsights={mockSelectedInsights}
      />
    );
    
    fireEvent.click(screen.getByText('Generate PNG'));
    
    await screen.findByText('Download PNG');
    const downloadLink = screen.getByText('Download PNG');
    expect(downloadLink).toBeInTheDocument();
    expect(downloadLink.getAttribute('download')).toBe('chess-insights.png');
  });
});