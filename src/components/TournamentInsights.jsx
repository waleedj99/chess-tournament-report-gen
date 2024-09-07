import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const TournamentInsights = ({ tournamentData }) => {
  // Dummy data for insights
  const insights = {
    shortestGame: "Game 12: White vs Black (15 moves)",
    longestGame: "Game 7: Alice vs Bob (78 moves)",
    mostAccurateGame: "Game 3: Charlie vs David (97% accuracy)",
    longestMove: "Game 5: Eve, Move 25 (8 minutes 30 seconds)",
    mostPopularOpening: "Sicilian Defense (23% of games)",
    mostDynamicGame: "Game 18: Frank vs Grace (21 advantage shifts)",
    topPerformers: [
      "1. Alice (95% avg. accuracy, 10 games)",
      "2. Bob (93% avg. accuracy, 9 games)",
      "3. Charlie (91% avg. accuracy, 11 games)"
    ]
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Insights for {tournamentData.name}</h2>
      <p>Tournament Type: {tournamentData.type}, Players: {tournamentData.players}, Total Games: {tournamentData.games}</p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Shortest Game</CardTitle>
          </CardHeader>
          <CardContent>{insights.shortestGame}</CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Longest Game</CardTitle>
          </CardHeader>
          <CardContent>{insights.longestGame}</CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Most Accurate Game</CardTitle>
          </CardHeader>
          <CardContent>{insights.mostAccurateGame}</CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Longest Move</CardTitle>
          </CardHeader>
          <CardContent>{insights.longestMove}</CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Most Popular Opening</CardTitle>
          </CardHeader>
          <CardContent>{insights.mostPopularOpening}</CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Most Dynamic Game</CardTitle>
          </CardHeader>
          <CardContent>{insights.mostDynamicGame}</CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Top Performers</CardTitle>
          </CardHeader>
          <CardContent>
            <ul>
              {insights.topPerformers.map((performer, index) => (
                <li key={index}>{performer}</li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TournamentInsights;