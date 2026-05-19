import React from 'react';
import { LineConfig } from '../../types';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

interface GenericLineChartProps {
  data: any[];
  unit?: string;
  lines?: LineConfig[];
}

const CustomTooltip = ({ active, payload, label, unit }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 border border-slate-200 rounded-lg shadow-lg text-sm">
        <p className="font-bold text-slate-800 mb-1">{`Year: ${label}`}</p>
        {payload.map((pld: any, index: number) => (
          <p key={index} style={{ color: pld.stroke }}>
            {`${pld.name}: `}
            <span className="font-semibold">{`${typeof pld.value === 'number' ? pld.value.toFixed(2) : pld.value}${unit ? ` ${unit}` : ''}`}</span>
          </p>
        ))}
      </div>
    );
  }
  return null;
};


const GenericLineChart: React.FC<GenericLineChartProps> = ({ data, unit, lines }) => {
  return (
    <div style={{ width: '100%', height: 300 }}>
      <ResponsiveContainer>
        <LineChart data={data} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="year" />
          <YAxis label={{ value: `Value ${unit ? `(${unit})` : ''}`, angle: -90, position: 'insideLeft' }} />
          <Tooltip content={<CustomTooltip unit={unit} />} />
          <Legend />
          {lines ? (
            lines.map(line => (
              <Line
                key={line.dataKey}
                type="monotone"
                dataKey={line.dataKey}
                name={line.name}
                stroke={line.color}
                strokeWidth={2}
                activeDot={{ r: 8 }}
              />
            ))
          ) : (
            // Fallback for single line chart
            <Line type="monotone" dataKey="value" name="Projected Value" stroke="#10b981" strokeWidth={2} activeDot={{ r: 8 }} />
          )}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default GenericLineChart;