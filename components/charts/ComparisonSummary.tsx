import React from 'react';
import { SimulationSnapshot } from '../../types';

interface ComparisonSummaryProps {
  snapshots: SimulationSnapshot[];
}

const ComparisonSummary: React.FC<ComparisonSummaryProps> = ({ snapshots }) => {
  const selectedSnapshots = snapshots.filter(s => s.isSelected && s.results);

  if (selectedSnapshots.length === 0) {
    return (
      <div className="bg-slate-50 p-6 rounded-lg border border-slate-200 text-center">
        <p className="text-slate-500">No simulations selected for comparison.</p>
        <p className="text-sm text-slate-400 mt-2">Select simulations using the checkboxes to compare their impacts.</p>
      </div>
    );
  }

  if (selectedSnapshots.length === 1) {
    return (
      <div className="bg-slate-50 p-6 rounded-lg border border-slate-200 text-center">
        <p className="text-slate-500">Select at least 2 simulations to compare.</p>
        <p className="text-sm text-slate-400 mt-2">Use the checkboxes to select multiple simulations.</p>
      </div>
    );
  }

  const maxSnapshots = Math.min(selectedSnapshots.length, 5); // Limit display to 5 for readability

  return (
    <div className="bg-white p-6 rounded-lg border border-slate-200">
      <h2 className="text-xl font-bold mb-4 text-slate-800">
        Comparison Summary ({selectedSnapshots.length} simulations)
      </h2>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                Metric
              </th>
              {selectedSnapshots.slice(0, maxSnapshots).map(snapshot => (
                <th key={snapshot.id} className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider whitespace-nowrap">
                  {snapshot.inputs.policyName}
                </th>
              ))}
              {selectedSnapshots.length > maxSnapshots && (
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  ... +{selectedSnapshots.length - maxSnapshots} more
                </th>
              )}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-slate-200">
            {/* Economic Impact */}
            <tr className="hover:bg-slate-50">
              <td className="px-4 py-3 text-sm font-medium text-slate-700">Economic Impact</td>
              {selectedSnapshots.slice(0, maxSnapshots).map(snapshot => {
                const val = snapshot.results?.economicImpact || 0;
                const isBest = Math.max(...selectedSnapshots.map(s => s.results?.economicImpact || 0)) === val;
                return (
                  <td className={`px-4 py-3 text-sm whitespace-nowrap ${isBest ? 'font-bold text-green-600' : 'text-slate-900'}`}>
                    {val > 0 ? '+' : ''}{val.toFixed(1)}%
                  </td>
                );
              })}
            </tr>

            {/* Social Impact */}
            <tr className="hover:bg-slate-50">
              <td className="px-4 py-3 text-sm font-medium text-slate-700">Social Impact</td>
              {selectedSnapshots.slice(0, maxSnapshots).map(snapshot => {
                const val = snapshot.results?.socialImpact || 0;
                const isBest = Math.max(...selectedSnapshots.map(s => s.results?.socialImpact || 0)) === val;
                return (
                  <td className={`px-4 py-3 text-sm whitespace-nowrap ${isBest ? 'font-bold text-green-600' : 'text-slate-900'}`}>
                    {val.toFixed(1)}/10
                  </td>
                );
              })}
            </tr>

            {/* Environmental Impact */}
            <tr className="hover:bg-slate-50">
              <td className="px-4 py-3 text-sm font-medium text-slate-700">Environmental Impact</td>
              {selectedSnapshots.slice(0, maxSnapshots).map(snapshot => {
                const val = snapshot.results?.environmentalImpact || 0;
                const isBest = Math.max(...selectedSnapshots.map(s => s.results?.environmentalImpact || 0)) === val;
                return (
                  <td className={`px-4 py-3 text-sm whitespace-nowrap ${isBest ? 'font-bold text-green-600' : 'text-slate-900'}`}>
                    {val > 0 ? '+' : ''}{val.toFixed(1)}%
                  </td>
                );
              })}
            </tr>

            {/* Confidence Level */}
            <tr className="hover:bg-slate-50">
              <td className="px-4 py-3 text-sm font-medium text-slate-700">Confidence</td>
              {selectedSnapshots.slice(0, maxSnapshots).map(snapshot => {
                const val = snapshot.results?.confidence || 0;
                return (
                  <td className="px-4 py-3 text-sm whitespace-nowrap text-slate-900">
                    {val.toFixed(1)}%
                  </td>
                );
              })}
            </tr>
          </tbody>
        </table>
      </div>

      {selectedSnapshots.length > maxSnapshots && (
        <p className="text-xs text-slate-500 mt-4 text-center">
          Showing top {maxSnapshots} simulations. Select more to see full details.
        </p>
      )}

      {/* Best performers highlight */}
      <div className="mt-6 bg-blue-50 p-4 rounded-lg border border-blue-200">
        <h3 className="text-sm font-semibold text-blue-800 mb-2">Best Performers</h3>
        <ul className="space-y-2 text-sm">
          {selectedSnapshots.map(snapshot => {
            const bestMetrics: string[] = [];
            if (snapshot.results) {
              const economicMax = Math.max(...selectedSnapshots.map(s => s.results?.economicImpact || 0));
              const socialMax = Math.max(...selectedSnapshots.map(s => s.results?.socialImpact || 0));
              const envMax = Math.max(...selectedSnapshots.map(s => s.results?.environmentalImpact || 0));

              if (snapshot.results.economicImpact === economicMax) bestMetrics.push('Economic');
              if (snapshot.results.socialImpact === socialMax) bestMetrics.push('Social');
              if (snapshot.results.environmentalImpact === envMax) bestMetrics.push('Environmental');
            }

            return bestMetrics.length > 0 ? (
              <li key={snapshot.id} className="flex items-center text-blue-700">
                <span className="font-semibold">{snapshot.inputs.policyName}</span>
                <span className="ml-2 text-xs bg-blue-200 px-2 py-1 rounded-full">
                  {bestMetrics.join(', ')} Leader
                </span>
              </li>
            ) : null;
          })}
        </ul>
      </div>
    </div>
  );
};

export default ComparisonSummary;
