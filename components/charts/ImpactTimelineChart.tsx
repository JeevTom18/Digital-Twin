import React from 'react';
import { HistoryEntry } from '../../types';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

interface ImpactTimelineChartProps {
  data: HistoryEntry[];
}

const ImpactTimelineChart: React.FC<ImpactTimelineChartProps> = ({ data }) => {
  // Mock timeline data generation for demonstration
  const generateTimeline = (baseScore: number) => {
    return Array.from({ length: 25 }, (_, i) => ({
      month: i,
      score: Math.max(0, (baseScore / 24) * i + (Math.random() - 0.5)),
    }));
  };

  const timelines = data.map(entry => ({
    name: entry.inputs.policyName.substring(0,20) + '...',
    data: generateTimeline(entry.results?.socialImpact || 0),
  }));

  const mergedData = Array.from({ length: 25 }, (_, i) => {
    const dataPoint: { month: number, [key: string]: number } = { month: i };
    timelines.forEach((timeline, index) => {
      dataPoint[`sim${index}`] = timeline.data[i].score;
    });
    return dataPoint;
  });

  const colors = ['#3b82f6', '#10b981', '#f59e0b'];

  return (
    <div style={{ width: '100%', height: 300 }}>
      <ResponsiveContainer>
        <LineChart data={mergedData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" label={{ value: 'Months', position: 'insideBottom', offset: -5 }} />
          <YAxis />
          <Tooltip />
          <Legend />
          {data.map((entry, index) => (
            <Line key={entry.id} type="monotone" dataKey={`sim${index}`} name={entry.inputs.policyName.substring(0,20) + '...'} stroke={colors[index]} strokeWidth={2} dot={false} />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ImpactTimelineChart;