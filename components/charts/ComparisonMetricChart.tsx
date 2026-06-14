import React from 'react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine } from 'recharts';
import { Metric, LineChartDataPoint, BarChartDataPoint, MultiLineChartDataPoint } from '../../types';

interface ComparisonMetricChartProps {
  metric: Metric;
  snapshots: any[]; // Array of simulation snapshots with results
  showLegend?: boolean;
}

const ComparisonMetricChart: React.FC<ComparisonMetricChartProps> = ({
  metric,
  snapshots,
  showLegend = true,
}) => {
  const { title, type, data, unit, description, lines, color } = metric;

  // Extract values for each snapshot
  const chartData = snapshots.map((snapshot, index) => ({
    snapshotId: snapshot.id,
    policyName: snapshot.inputs.policyName,
    ...(data as any[]).map((item: any) => {
      const dataKey = Object.keys(item).find(key => item[key]) || '';
      return { [dataKey]: item[dataKey] };
    }),
  }));

  const renderLineChart = () => {
    const dataWithNames = snapshots.map((snapshot, index) => {
      const baseData = (data as LineChartDataPoint[]).map(item => ({
        year: item.year,
        [snapshot.inputs.policyName]: item.value,
      }));
      return baseData;
    }).flat();

    // Flatten the data properly
    const years = Array.from(new Set((data as LineChartDataPoint[]).map((d: LineChartDataPoint) => d.year)));
    const chartDataPoints = years.map(year => {
      const point: any = { year };
      snapshots.forEach((snapshot, idx) => {
        const value = (data as LineChartDataPoint[]).find((d: LineChartDataPoint) => d.year === year);
        if (value) point[snapshot.inputs.policyName] = value.value;
      });
      return point;
    });

    return (
      <ResponsiveContainer width="100%" height={350}>
        <LineChart data={chartDataPoints} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="year" label={{ value: 'Year', position: 'insideBottom', offset: -5 }} />
          <YAxis label={{ value: unit || 'Value', angle: -90, position: 'insideLeft' }} />
          <Tooltip formatter={(value: number) => [`${value} ${unit || ''}`, '']} />
          {showLegend && <Legend />}
          {lines?.map((line, idx) => (
            <Line
              key={idx}
              type="monotone"
              dataKey={line.dataKey as string}
              stroke={line.color}
              strokeWidth={2}
              dot={{ r: 4 }}
              activeDot={{ r: 6 }}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    );
  };

  const renderBarChart = () => {
    const chartDataPoints = (data as BarChartDataPoint[]).map(item => {
      const cat = item.category;
      const point: any = { category: cat };
      snapshots.forEach((snapshot, idx) => {
        point[snapshot.inputs.policyName] = (data as BarChartDataPoint[])
          .find((d: BarChartDataPoint) => d.category === cat)?.value || 0;
      });
      return point;
    });

    return (
      <ResponsiveContainer width="100%" height={350}>
        <BarChart data={chartDataPoints} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="category" />
          <YAxis label={{ value: unit || 'Value', angle: -90, position: 'insideLeft' }} />
          <Tooltip formatter={(value: number) => [`${value} ${unit || ''}`, '']} />
          {showLegend && <Legend />}
          {snapshots.map((snapshot, idx) => (
            <Bar
              key={snapshot.id}
              dataKey={snapshot.inputs.policyName}
              fill={color || `hsl(${idx * 60}, 70%, 50%)`}
            />
          ))}
        </BarChart>
      </ResponsiveContainer>
    );
  };

  return (
    <div className="bg-white p-4 rounded-lg border border-slate-200">
      <h3 className="text-lg font-semibold mb-2 text-slate-800">{title}</h3>
      {description && <p className="text-sm text-slate-500 mb-4">{description}</p>}
      {type === 'line-chart' && renderLineChart()}
      {type === 'bar-chart' && renderBarChart()}
      {type === 'heatmap' && (
        <div className="text-slate-500 text-center py-8">
          Heatmap comparison not yet available. Please check the individual simulation results.
        </div>
      )}
    </div>
  );
};

export default ComparisonMetricChart;
