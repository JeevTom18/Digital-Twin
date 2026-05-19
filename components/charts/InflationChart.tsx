import React from 'react';
import { BarChartDataPoint } from '../../types';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

interface GenericBarChartProps {
  data: BarChartDataPoint[];
  unit?: string;
  color?: string;
}

const CustomTooltip = ({ active, payload, label, unit }: any) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-white p-3 border border-slate-200 rounded-lg shadow-lg text-sm">
                <p className="font-bold text-slate-800 mb-1">{label}</p>
                <p style={{ color: payload[0].fill }}>
                    {`${payload[0].name}: `}
                    <span className="font-semibold">{`${typeof payload[0].value === 'number' ? payload[0].value.toFixed(2) : payload[0].value}${unit ? ` ${unit}` : ''}`}</span>
                </p>
            </div>
        );
    }
    return null;
};

const GenericBarChart: React.FC<GenericBarChartProps> = ({ data, unit, color = '#3b82f6' }) => {
  return (
    <div style={{ width: '100%', height: 300 }}>
      <ResponsiveContainer>
        <BarChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="category" />
          <YAxis label={{ value: `Value ${unit ? `(${unit})` : ''}`, angle: -90, position: 'insideLeft' }} />
          <Tooltip content={<CustomTooltip unit={unit} />} cursor={{fill: 'rgba(200, 200, 200, 0.2)'}}/>
          <Legend />
          <Bar dataKey="value" name="Value" fill={color} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default GenericBarChart;