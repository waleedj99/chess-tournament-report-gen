import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const TournamentInsights = ({ tournamentData }) => {
  // Placeholder functions for calculating insights
  const calculateShortestGame = () => "Game 1 (15 moves)";
  const calculateLongestGame = () => "Game 5 (78 moves)";
  const calculateMostAccurateGame = () => "Player A vs Player B (95% accuracy)";
  const calculateLongestMove = () => "Player C, Game 3, Move 25 (5 minutes)";
  const calculateMostPopularOpening = () => "Sicilian Defense";
  const calculateMostDynamicGame = () => "Game 7 (15 advantage shifts)";
  const calculateTopPerformers = () => "1. Player D (90% avg. accuracy, 10 games)";

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Shortest Game</CardTitle>
        </CardHeader>
        <CardContent>{calculateShortestGame()}</CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Longest Game</CardTitle>
        </CardHeader>
        <CardContent>{calculateLongestGame()}</CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Most Accurate Game</CardTitle>
        </CardHeader>
        <CardContent>{calculateMostAccurateGame()}</CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Longest Move</CardTitle>
        </CardHeader>
        <CardContent>{calculateLongestMove()}</CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Most Popular Opening</CardTitle>
        </CardHeader>
        <CardContent>{calculateMostPopularOpening()}</CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Most Dynamic Game</CardTitle>
        </CardHeader>
        <CardContent>{calculateMostDynamicGame()}</CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Top Performers</CardTitle>
        </CardHeader>
        <CardContent>{calculateTopPerformers()}</CardContent>
      </Card>
    </div>
  );
};

export default TournamentInsights;