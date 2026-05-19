import React from 'react';
import Card from './ui/Card';
import { TrendingUpIcon } from './icons';

interface SummaryCardProps {
  title: string;
  value: string;
  trend?: string;
  hasTrendIcon?: boolean;
  icon: React.ReactNode;
  color: 'blue' | 'green' | 'orange';
}

const SummaryCard: React.FC<SummaryCardProps> = ({ title, value, trend, hasTrendIcon, icon, color }) => {
  const colorClasses = {
    blue: 'bg-blue-600 text-white',
    green: 'bg-green-500 text-white',
    orange: 'bg-orange-500 text-white',
  };
  
  const selectedColor = color === 'green' ? colorClasses.green : color === 'blue' ? colorClasses.blue : colorClasses.orange;

  return (
    <Card className="p-4">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm font-medium text-slate-600">{title}</p>
          <p className="text-4xl font-bold text-slate-900 mt-2">{value}</p>
          {trend && (
            <div className="flex items-center text-sm text-slate-500 mt-2">
              {hasTrendIcon && <TrendingUpIcon className="w-4 h-4 mr-1 text-slate-400" />}
              <span>{trend}</span>
            </div>
          )}
        </div>
        <div className={`p-3 rounded-xl ${selectedColor}`}>
          {icon}
        </div>
      </div>
    </Card>
  );
};

export default SummaryCard;
