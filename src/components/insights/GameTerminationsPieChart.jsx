import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

const COLORS = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEEAD', '#D4D4D4'];

const GameTerminationsPieChart = ({ data }) => {
  const formattedData = data.map(item => ({
    name: item.terminationType === 'mate' ? 'Checkmate' :
          item.terminationType === 'resign' ? 'Resignation' :
          item.terminationType === 'outoftime' ? 'Timeout' :
          item.terminationType === 'draw' ? 'Draw' :
          item.terminationType === 'stalemate' ? 'Stalemate' : 'Other',
    value: parseInt(item.count)
  }));

  return (
    <div className="w-full h-[300px] mt-4">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={formattedData}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, percent }) => `${name} (${(percent * 100).toFixed(1)}%)`}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
          >
            {formattedData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default GameTerminationsPieChart;