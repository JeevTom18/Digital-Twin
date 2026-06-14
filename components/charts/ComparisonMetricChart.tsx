import React from 'react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Metric, LineChartDataPoint, BarChartDataPoint, WellBeingData } from '../../types';

interface ComparisonMetricChartProps {
  metric: Metric;
  snapshots: any[];
  showLegend?: boolean;
}

const ComparisonMetricChart: React.FC<ComparisonMetricChartProps> = ({
  metric,
  snapshots,
  showLegend = true,
}) => {
  const { title, type, data, unit, description } = metric;

  // Handle different data types for comparison
  if (type === 'heatmap') {
    // Show heatmap data as a sortable table for comparison
    const wellBeingData = data as WellBeingData[];

    return (
      <div className="bg-white p-4 rounded-lg border border-slate-200">
        <h3 className="text-lg font-semibold mb-2 text-slate-800">{title}</h3>
        {description && <p className="text-sm text-slate-500 mb-4">{description}</p>}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200 text-sm">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-3 py-2 text-left text-xs font-medium text-slate-500 uppercase">State</th>
                {snapshots.map((snapshot, idx) => {
                  const snapshotData = wellBeingData.find(d => d.state === snapshot.inputs.policyName);
                  return (
                    <th key={idx} className="px-3 py-2 text-center text-xs font-medium text-slate-500 uppercase">
                      {snapshot.inputs.policyName}
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-200">
              {wellBeingData.map((wb, idx) => (
                <tr key={idx} className="hover:bg-slate-50">
                  <td className="px-3 py-2 whitespace-nowrap text-slate-900">{wb.state}</td>
                  {snapshots.map((snapshot, sIdx) => {
                    const wbData = wellBeingData.find(w => w.state === wb.state);
                    const impactScore = wbData?.impactScore || 0;
                    // Color based on score
                    const bgColor = impactScore >= 6 ? 'bg-green-100' : impactScore >= 4 ? 'bg-yellow-100' : 'bg-red-100';
                    return (
                      <td key={sIdx} className="px-3 py-2 text-center">
                        <span className={`px-2 py-1 rounded-full ${bgColor} text-slate-700 font-medium`}>
                          {impactScore}
                        </span>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  const renderLineChart = () => {
    // Flatten data for comparison - merge all snapshot data points
    const years = Array.from(new Set((data as LineChartDataPoint[]).map((d: LineChartDataPoint) => d.year)));

    const chartDataPoints = years.map(year => {
      const point: any = { year };

      snapshots.forEach((snapshot) => {
        const dataPoint = (data as LineChartDataPoint[]).find((d: LineChartDataPoint) => d.year === year);
        if (dataPoint) {
          // Use policy name as the key for comparison
          point[snapshot.inputs.policyName] = dataPoint.value as number;
        }
      });

      return point;
    });

    return (
      <ResponsiveContainer width="100%" height={350}>
        <LineChart data={chartDataPoints} margin={{ top: 5, right: 30, left: 20, bottom: 25 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="year"
            label={{ value: 'Year', position: 'insideBottom', offset: -5 }}
            padding={{ left: 30, right: 30 }}
          />
          <YAxis
            label={{ value: unit || 'Value', angle: -90, position: 'insideLeft' }}
          />
          <Tooltip
            contentStyle={{ backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: '8px' }}
            formatter={(value: number, name: any) => [`${value.toFixed(1)} ${unit || ''}`, name]}
          />
          {showLegend && <Legend />}
          {snapshots.map((snapshot, idx) => (
            <Line
              key={snapshot.id}
              type="monotone"
              dataKey={snapshot.inputs.policyName}
              stroke={snapshot.inputs.policyType.includes('Health') ? '#3b82f6' : snapshot.inputs.policyType.includes('Agriculture') ? '#10b981' : '#8b5cf6'}
              strokeWidth={2}
              dot={{ r: 5, strokeWidth: 2 }}
              activeDot={{ r: 6 }}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    );
  };

  const renderBarChart = () => {
    const categories = Array.from(new Set((data as BarChartDataPoint[]).map((d: BarChartDataPoint) => d.category)));

    const chartDataPoints = categories.map(category => {
      const point: any = { category };
      snapshots.forEach((snapshot) => {
        const dataPoint = (data as BarChartDataPoint[]).find((d: BarChartDataPoint) => d.category === category);
        point[snapshot.inputs.policyName] = dataPoint?.value || 0;
      });
      return point;
    });

    return (
      <ResponsiveContainer width="100%" height={350}>
        <BarChart data={chartDataPoints} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="category" />
          <YAxis label={{ value: unit || 'Value', angle: -90, position: 'insideLeft' }} />
          <Tooltip
            contentStyle={{ backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: '8px' }}
            formatter={(value: number, name: any) => [`${value.toFixed(1)} ${unit || ''}`, name]}
          />
          {showLegend && <Legend />}
          {snapshots.map((snapshot, idx) => (
            <Bar
              key={snapshot.id}
              dataKey={snapshot.inputs.policyName}
              fill={snapshot.inputs.policyType.includes('Health') ? '#3b82f6' : snapshot.inputs.policyType.includes('Agriculture') ? '#10b981' : '#8b5cf6'}
              radius={[4, 4, 0, 0]}
            />
          ))}
        </BarChart>
      </ResponsiveContainer>
    );
  };

  return (
    <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm">
      <h3 className="text-lg font-semibold mb-2 text-slate-800">{title}</h3>
      {description && <p className="text-sm text-slate-500 mb-4">{description}</p>}
      {type === 'line-chart' && renderLineChart()}
      {type === 'bar-chart' && renderBarChart()}
    </div>
  );
};

export default ComparisonMetricChart;
