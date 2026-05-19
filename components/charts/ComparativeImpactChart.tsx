import React from 'react';
import { HistoryEntry } from '../../types';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

interface ComparativeImpactChartProps {
  data: HistoryEntry[];
}

const ComparativeImpactChart: React.FC<ComparativeImpactChartProps> = ({ data }) => {
  const chartData = [
    { name: 'Economic', ...data.reduce((acc, entry, index) => ({ ...acc, [`sim${index}`]: entry.results?.economicImpact }), {}) },
    { name: 'Social', ...data.reduce((acc, entry, index) => ({ ...acc, [`sim${index}`]: entry.results?.socialImpact }), {}) },
    { name: 'Environmental', ...data.reduce((acc, entry, index) => ({ ...acc, [`sim${index}`]: entry.results?.environmentalImpact }), {}) },
  ];

  const colors = ['#3b82f6', '#10b981', '#f59e0b'];

  return (
    <div style={{ width: '100%', height: 300 }}>
      <ResponsiveContainer>
        <BarChart data={chartData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          {data.map((entry, index) => (
            <Bar key={entry.id} dataKey={`sim${index}`} name={entry.inputs.policyName.substring(0,20) + '...'} fill={colors[index]} />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ComparativeImpactChart;