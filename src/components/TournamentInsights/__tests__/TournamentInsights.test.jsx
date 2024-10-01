import React from 'react';
import { render, screen } from '@testing-library/react';
import TournamentInsights from '../TournamentInsights';

const mockTournamentData = {
  name: 'Test Tournament',
  type: 'swiss',
  players: 10,
};

const mockInsights = {
  SHORTEST_GAME_LENGTH_BY_MOVES: [
    { gameId: '123', players: { white: { user: { name: 'Player1' } }, black: { user: { name: 'Player2' } } }, value: 10 },
  ],
  LONGEST_GAME_LENGTH_BY_MOVES: [
    { gameId: '456', players: { white: { user: { name: 'Player3' } }, black: { user: { name: 'Player4' } } }, value: 100 },
  ],
};

describe('TournamentInsights', () => {
  test('renders tournament information', () => {
    render(
      <TournamentInsights
        tournamentData={mockTournamentData}
        insights={mockInsights}
        analysedGames={5}
        totalGames={10}
      />
    );
    expect(screen.getByText('Insights for Test Tournament')).toBeInTheDocument();
    expect(screen.getByText('Tournament Type: swiss, Players: 10, Total Games: 10')).toBeInTheDocument();
  });

  test('displays analysis progress', () => {
    render(
      <TournamentInsights
        tournamentData={mockTournamentData}
        insights={mockInsights}
        analysedGames={5}
        totalGames={10}
      />
    );
    expect(screen.getByText('5 / 10 games analyzed')).toBeInTheDocument();
  });

  test('renders insight cards', () => {
    render(
      <TournamentInsights
        tournamentData={mockTournamentData}
        insights={mockInsights}
        analysedGames={5}
        totalGames={10}
      />
    );
    expect(screen.getByText('Shortest Game Length By Moves')).toBeInTheDocument();
    expect(screen.getByText('Longest Game Length By Moves')).toBeInTheDocument();
  });

  test('displays insight content', () => {
    render(
      <TournamentInsights
        tournamentData={mockTournamentData}
        insights={mockInsights}
        analysedGames={5}
        totalGames={10}
      />
    );
    expect(screen.getByText('#1 - Moves: 10')).toBeInTheDocument();
    expect(screen.getByText('Players: Player1 vs Player2')).toBeInTheDocument();
    expect(screen.getByText('#1 - Moves: 100')).toBeInTheDocument();
    expect(screen.getByText('Players: Player3 vs Player4')).toBeInTheDocument();
  });
});