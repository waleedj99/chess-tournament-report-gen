import React from 'react';
import { PieChart, Pie, Cell, Legend, Tooltip } from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

const GameTerminationsPieChart = ({ data }) => {
  console.log('GameTerminationsPieChart data:', data); // Debug log

  // Ensure data is an array and has items
  if (!Array.isArray(data) || data.length === 0) {
    console.warn('Invalid or empty data provided to GameTerminationsPieChart');
    return <div>No termination data available</div>;
  }

  const chartData = data.map(item => ({
    name: item.terminationType === 'outoftime' ? 'Timeout' : 
          item.terminationType === 'mate' ? 'Checkmate' :
          item.terminationType === 'resign' ? 'Resignation' :
          item.terminationType === 'draw' ? 'Draw' :
          item.terminationType === 'stalemate' ? 'Stalemate' : 
          'Other',
    value: parseInt(item.count)
  }));

  return (
    <div className="w-full h-[300px] flex justify-center items-center">
      <PieChart width={300} height={300}>
        <Pie
          data={chartData}
          cx="50%"
          cy="50%"
          labelLine={false}
          outerRadius={80}
          fill="#8884d8"
          dataKey="value"
          label={({ name, percent }) => `${(percent * 100).toFixed(0)}%`}
        >
          {chartData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>
    </div>
  );
};

export default GameTerminationsPieChart;