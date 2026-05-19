import React, { useState, useMemo } from 'react';
import PageHeader from '../components/PageHeader';
import Card from '../components/ui/Card';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { HistoryEntry } from '../types';
import ComparativeImpactChart from '../components/charts/ComparativeImpactChart';
import ImpactTimelineChart from '../components/charts/ImpactTimelineChart';

const ImpactAnalysisPage: React.FC = () => {
  const [history] = useLocalStorage<HistoryEntry[]>('simulationHistory', []);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const completedSimulations = useMemo(() => history.filter(h => h.status === 'completed' && h.results), [history]);

  const handleSelectionChange = (id: string) => {
    setSelectedIds(prev => {
      if (prev.includes(id)) {
        return prev.filter(selectedId => selectedId !== id);
      }
      if (prev.length < 3) {
        return [...prev, id];
      }
      return prev;
    });
  };

  const selectedSimulations = useMemo(() => {
    return completedSimulations.filter(sim => selectedIds.includes(sim.id));
  }, [selectedIds, completedSimulations]);

  return (
    <div>
      <PageHeader
        title="Impact Analysis"
        subtitle="Compare and analyze detailed policy impacts"
      />
      <Card className="mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
                <h3 className="font-semibold text-slate-800">Analyze Simulations</h3>
                <p className="text-sm text-slate-500">Select up to 3 simulations to compare.</p>
            </div>
            <div className="mt-3 sm:mt-0">
                <div className="relative">
                    <select 
                        className="block w-full sm:w-80 appearance-none pl-3 pr-10 py-2 bg-white border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        value={selectedIds.length > 0 ? selectedIds[0] : ''} // This is just for display, multi-select is handled in the dropdown
                        onChange={(e) => handleSelectionChange(e.target.value)}
                    >
                        <option value="" disabled>{selectedSimulations.length > 0 ? `${selectedSimulations.length} selected` : 'Select simulations...'}</option>
                        {completedSimulations.map(sim => (
                            <option key={sim.id} value={sim.id} disabled={selectedIds.length >= 3 && !selectedIds.includes(sim.id)}>
                                {sim.inputs.policyName}
                            </option>
                        ))}
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-500">
                        <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                            <path fillRule="evenodd" d="M10 3a.75.75 0 01.53.22l3.5 3.5a.75.75 0 01-1.06 1.06L10 4.81 6.53 8.28a.75.75 0 01-1.06-1.06l3.5-3.5A.75.75 0 0110 3zm-3.72 9.28a.75.75 0 011.06 0L10 15.19l3.47-3.47a.75.75 0 111.06 1.06l-4 4a.75.75 0 01-1.06 0l-4-4a.75.75 0 010-1.06z" clipRule="evenodd" />
                        </svg>
                    </div>
                </div>
                <div className="text-sm text-slate-600 mt-2">Comparing {selectedSimulations.length} of {Math.min(3, completedSimulations.length)} simulations.</div>
            </div>
        </div>
        {selectedIds.length > 0 && (
             <div className="mt-4 space-y-2">
                {selectedSimulations.map((sim, index) => (
                    <div key={sim.id} className="flex items-center text-sm">
                        <span className={`w-3 h-3 rounded-full mr-2`} style={{backgroundColor: ['#3b82f6', '#10b981', '#f59e0b'][index]}}></span>
                        <span className="font-medium text-slate-700">{sim.inputs.policyName}</span>
                        <button onClick={() => handleSelectionChange(sim.id)} className="ml-2 text-red-500 hover:text-red-700 text-xs">remove</button>
                    </div>
                ))}
            </div>
        )}
      </Card>
      
      {selectedSimulations.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
                <h3 className="font-semibold text-slate-800 mb-4">Comparative Impact Score</h3>
                <ComparativeImpactChart data={selectedSimulations} />
            </Card>
             <Card>
                <h3 className="font-semibold text-slate-800 mb-4">Impact Timeline</h3>
                <ImpactTimelineChart data={selectedSimulations} />
            </Card>
        </div>
      ) : (
        <Card>
            <div className="text-center py-20">
              <h3 className="text-lg font-semibold text-slate-700">Select simulations to begin analysis</h3>
              <p className="text-sm text-slate-500 mt-2">Choose one or more completed simulations from the dropdown above to compare their results.</p>
            </div>
        </Card>
      )}

    </div>
  );
};

export default ImpactAnalysisPage;