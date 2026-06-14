import React from 'react';
import { HistoryEntry } from '../types';
import Card from './ui/Card';
import { DraftIcon, CompletedAnalysesIcon, ComparisonIcon } from './icons';

interface RecentSimulationsProps {
  history: HistoryEntry[];
  onSelect: (entry: HistoryEntry) => void;
}

const getPolicyTypeStyles = (policyType: string) => {
    switch (policyType) {
        case 'Environmental Policy': return 'bg-blue-100 text-blue-700';
        case 'Agricultural Policy': return 'bg-green-100 text-green-700';
        case 'Education Policy': return 'bg-purple-100 text-purple-700';
        case 'Healthcare Policy': return 'bg-red-100 text-red-700';
        case 'Tax Reform': return 'bg-red-100 text-red-700';
        case 'Industrial Policy': return 'bg-indigo-100 text-indigo-700';
        default: return 'bg-slate-100 text-slate-700';
    }
};

const getStatusBadge = (status: 'draft' | 'completed' | 'running') => {
    const styles = {
        draft: 'bg-slate-100 text-slate-600',
        completed: 'bg-green-100 text-green-700',
        running: 'bg-blue-100 text-blue-700'
    };
    const icons = {
        draft: <DraftIcon className="w-3.5 h-3.5 mr-1.5" />,
        completed: <CompletedAnalysesIcon className="w-3.5 h-3.5 mr-1.5" />,
        running: null
    };

    return (
        <span className={`inline-flex items-center px-2.5 py-1 text-xs font-semibold rounded-full ${styles[status]}`}>
            {icons[status]}
            {status}
        </span>
    );
}

const MetricDisplay: React.FC<{label: string, value: string}> = ({ label, value }) => (
    <div>
        <span className="text-sm text-slate-500">{label}: </span>
        <span className="font-semibold text-sm text-slate-800">{value}</span>
    </div>
);

const RecentSimulations: React.FC<RecentSimulationsProps> = ({ history, onSelect }) => {
  const completedCount = history.filter(h => h.status === 'completed').length;

  return (
    <Card className="h-full">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-bold text-slate-800 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 text-slate-500"><path d="M12 20V10"></path><path d="M18 20V4"></path><path d="M6 20V16"></path></svg>
            Recent Simulations
        </h2>
        <div className="flex gap-2">
          <button
            onClick={() => window.location.hash = 'comparison'}
            disabled={completedCount < 2}
            className="flex items-center text-slate-500 hover:text-blue-600 p-1.5 rounded-full hover:bg-blue-50 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-transparent"
            title={completedCount < 2 ? 'Need at least 2 completed simulations to compare' : 'Compare Simulations'}
          >
            <ComparisonIcon className="w-5 h-5" />
          </button>
          <button className="text-slate-500 hover:text-slate-700 p-1.5 rounded-full hover:bg-slate-100">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 4 23 10 17 10"></polyline><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"></path></svg>
          </button>
        </div>
      </div>
      {history.length === 0 ? (
        <div className="text-center py-12">
            <p className="text-sm text-slate-500">No simulations have been run yet.</p>
            <p className="text-xs text-slate-400 mt-1">Start by clicking 'New Simulation'.</p>
        </div>
      ) : (
        <ul className="space-y-4">
          {history.map((entry) => (
            <li
              key={entry.id}
              onClick={() => onSelect(entry)}
              className="p-4 bg-white rounded-lg cursor-pointer hover:bg-slate-50 border border-slate-200 transition-all shadow-sm hover:shadow-md"
            >
                <div className="flex justify-between items-start">
                    <h3 className="font-bold text-base text-slate-900 pr-4">{entry.inputs.policyName}</h3>
                    {getStatusBadge(entry.status)}
                </div>
                <div className="flex items-center text-xs text-slate-500 my-2 space-x-3">
                    <span className={`px-2 py-0.5 font-medium rounded lowercase ${getPolicyTypeStyles(entry.inputs.policyType)}`}>
                        {entry.inputs.policyType.replace(' Policy', '')}
                    </span>
                    <span>{new Date(entry.id).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                </div>

                <p className="text-sm text-slate-600 my-3">{entry.inputs.policyDescription}</p>
                
                {entry.status !== 'running' && entry.results && (
                  <>
                    <hr className="border-slate-100 my-3" />
                    <div className="grid grid-cols-1 gap-4 text-left sm:grid-cols-3">
                        <MetricDisplay 
                            label="Economic Impact" 
                            value={`${entry.results.economicImpact > 0 ? '+' : ''}${entry.results.economicImpact.toFixed(1)}%`}
                        />
                        <MetricDisplay 
                            label="Social Impact" 
                            value={`${entry.results.socialImpact.toFixed(1)}/10`}
                        />
                        <MetricDisplay 
                            label="Confidence" 
                            value={`${entry.results.confidence}%`}
                        />
                    </div>
                  </>
                )}
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
};

export default RecentSimulations;