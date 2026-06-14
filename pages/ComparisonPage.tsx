import React, { useState, useMemo, useEffect } from 'react';
import { SimulationSnapshot, HistoryEntry } from '../types';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import { BackIcon, ComparisonIcon } from '../components/icons';

interface ComparisonPageProps {
  history: HistoryEntry[];
}

const ComparisonPage: React.FC<ComparisonPageProps> = ({ history }) => {
  const [selectedSnapshotIds, setSelectedSnapshotIds] = useState<Set<string>>(new Set());

  // Debug log history
  useEffect(() => {
    console.log('ComparisonPage received history:', history.length, 'entries');
    console.log('History entries:', history.map(h => ({ id: h.id, status: h.status, hasResults: !!h.results })));
  }, [history]);

  // Convert history to snapshots for comparison
  const comparisonData = useMemo(() => {
    const filtered = history.filter(entry => entry.status === 'completed' && entry.results);
    console.log('ComparisonPage - Filtered to completed with results:', filtered.length);
    filtered.forEach(s => console.log(`- ${s.inputs.policyName}`));

    return filtered.map(entry => ({
      id: entry.id,
      timestamp: entry.timestamp,
      inputs: entry.inputs,
      results: entry.results,
      isSelected: selectedSnapshotIds.has(entry.id),
    }));
  }, [history, selectedSnapshotIds]);

  const toggleSelection = (id: string) => {
    setSelectedSnapshotIds(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const selectAll = () => {
    const allCompletedIds = history
      .filter(entry => entry.status === 'completed' && entry.results)
      .map(entry => entry.id);
    setSelectedSnapshotIds(new Set(allCompletedIds));
  };

  const clearSelection = () => {
    setSelectedSnapshotIds(new Set());
  };

  const compareSelected = () => {
    const selectedIds = Array.from(selectedSnapshotIds);
    console.log('CompareSelected called - Selected IDs:', selectedIds);
    console.log('CompareSelected - History length:', history.length);

    if (selectedIds.length >= 2) {
      const selectionString = JSON.stringify(selectedIds);
      sessionStorage.setItem('comparisonSelection', selectionString);
      console.log('Set session storage:', selectionString);
      window.location.hash = 'comparison-results';
      console.log('Navigated to comparison-results');
    } else {
      alert(`Please select at least 2 simulations to compare. Currently: ${selectedSnapshotIds.size}`);
    }
  };

  const toggleAllSelection = (id: string, isSelected: boolean) => {
    setSelectedSnapshotIds(prev => {
      const newSet = new Set(prev);
      if (isSelected) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  return (
    <div>
      <div className="flex items-center mb-6">
        <button onClick={() => window.location.hash = 'dashboard'} className="p-2 rounded-full hover:bg-slate-200 mr-3">
          <BackIcon />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Scenario Comparison</h1>
          <p className="mt-1 text-sm text-slate-600">Select and compare multiple policy simulation results</p>
        </div>
      </div>

      <Card>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-800">Select Simulations</h2>
          <div className="flex gap-2">
            <Button onClick={selectAll} variant="secondary">
              Select All
            </Button>
            <Button onClick={clearSelection} variant="secondary">
              Clear
            </Button>
            <Button onClick={compareSelected} disabled={selectedSnapshotIds.size < 2}>
              <ComparisonIcon className="w-4 h-4 mr-2" />
              Compare ({selectedSnapshotIds.size >= 2 ? selectedSnapshotIds.size : 0})
            </Button>
          </div>
        </div>

        {comparisonData.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-slate-500 text-lg">No completed simulations available for comparison.</p>
            <p className="text-slate-400 mt-2">Create simulations first to compare them.</p>
            {history.length > 0 && (
              <p className="text-slate-600 mt-4 text-sm">Total history entries: {history.length}</p>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-4 py-3 text-left">
                    <input
                      type="checkbox"
                      className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                      checked={comparisonData.length > 0 && comparisonData.every(s => s.isSelected)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          selectAll();
                        } else {
                          clearSelection();
                        }
                      }}
                    />
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Policy Name
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Budget
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Coverage
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Economic
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Social
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Environmental
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-slate-200">
                {comparisonData.map((snapshot) => (
                  <tr
                    key={snapshot.id}
                    className={`hover:bg-slate-50 cursor-pointer transition-colors ${
                      snapshot.isSelected ? 'bg-blue-50' : ''
                    }`}
                    onClick={() => toggleSelection(snapshot.id)}
                  >
                    <td className="px-4 py-3">
                      <input
                        type="checkbox"
                        checked={snapshot.isSelected}
                        onChange={(e) => {
                          e.stopPropagation();
                          toggleAllSelection(snapshot.id, snapshot.isSelected);
                        }}
                        className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                      />
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-sm font-medium text-slate-900">{snapshot.inputs.policyName}</div>
                      <div className="text-xs text-slate-500">{snapshot.timestamp}</div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-1 text-xs font-semibold rounded-full bg-slate-100 text-slate-700">
                        {snapshot.inputs.policyType}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-600">
                      ₹{snapshot.inputs.parameters.budgetAllocation} Cr
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-600">
                      {snapshot.inputs.parameters.targetCoverage}%
                    </td>
                    <td className="px-4 py-3 text-sm font-semibold">
                      <span className={snapshot.results?.economicImpact > 0 ? 'text-green-600' : 'text-red-600'}>
                        {snapshot.results?.economicImpact > 0 ? '+' : ''}
                        {snapshot.results?.economicImpact.toFixed(1)}%
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm font-semibold">
                      <span className="text-blue-600">
                        {snapshot.results?.socialImpact.toFixed(1)}/10
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm font-semibold">
                      <span className={snapshot.results?.environmentalImpact > 0 ? 'text-green-600' : 'text-red-600'}>
                        {snapshot.results?.environmentalImpact > 0 ? '+' : ''}
                        {snapshot.results?.environmentalImpact.toFixed(1)}%
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm whitespace-nowrap">
                      <Button
                        onClick={(e) => {
                          e.stopPropagation();
                          window.location.hash = 'policy-simulator';
                          sessionStorage.setItem('selectedSimulationId', snapshot.id);
                        }}
                        variant="secondary"
                        className="py-1 px-3 text-xs"
                      >
                        View Details
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {selectedSnapshotIds.size >= 2 && (
        <div className="mt-6 flex justify-center">
          <Button onClick={compareSelected} className="px-8 py-3 text-lg">
            <ComparisonIcon className="w-5 h-5 mr-2" />
            Compare Selected ({selectedSnapshotIds.size} simulations)
          </Button>
        </div>
      )}
    </div>
  );
};

export default ComparisonPage;
