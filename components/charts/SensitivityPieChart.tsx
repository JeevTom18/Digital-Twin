import React from 'react';
import { SensitivityFactor } from '../../types';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';

interface SensitivityPieChartProps {
  data: SensitivityFactor[];
}

const SensitivityPieChart: React.FC<SensitivityPieChartProps> = ({ data }) => {
  return (
    <div style={{ width: '100%', height: 250 }}>
      <ResponsiveContainer>
        <PieChart>
          <Pie
            // FIX: Cast data to `any` to resolve a type incompatibility with recharts' Pie component.
            // The component expects a generic object array, and our strict `SensitivityFactor` type lacks an index signature.
            data={data as any}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={80}
            fill="#8884d8"
            paddingAngle={5}
            dataKey="value"
            nameKey="name"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip formatter={(value: number, name: string) => [`${value}%`, name]} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default SensitivityPieChart;