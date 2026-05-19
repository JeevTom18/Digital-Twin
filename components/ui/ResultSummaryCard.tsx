import React from 'react';

interface ResultSummaryCardProps {
    label: string;
    value: string | number;
    unit?: string;
}

const ResultSummaryCard: React.FC<ResultSummaryCardProps> = ({label, value, unit}) => (
    <div className="bg-slate-50 p-4 rounded-lg text-center">
        <p className="text-sm text-slate-500">{label}</p>
        <p className="text-2xl font-bold text-slate-800 mt-1">
            {value}
            {unit && <span className="text-base font-medium ml-1">{unit}</span>}
        </p>
    </div>
);

export default ResultSummaryCard;
