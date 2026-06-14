import React, { useState, useMemo, useEffect } from 'react';
import { SimulationSnapshot, Metric, LineChartDataPoint, BarChartDataPoint, WellBeingData, MultiLineChartDataPoint } from '../types';
import ComparisonSummary from '../components/charts/ComparisonSummary';
import ComparisonMetricChart from '../components/charts/ComparisonMetricChart';
import GenericLineChart from '../components/charts/FarmerIncomeChart';
import GenericBarChart from '../components/charts/InflationChart';
import WellBeingHeatmap from '../components/charts/WellBeingHeatmap';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import { BackIcon, ComparisonIcon } from '../components/icons';

interface ComparisonResultsPageProps {
  history: any[];
}

const ComparisonResultsPage: React.FC<ComparisonResultsPageProps> = ({ history }) => {
  const [activeTab, setActiveTab] = useState<'summary' | 'metrics' | 'details'>('summary');

  // Debug: Check session storage
  useEffect(() => {
    const selection = sessionStorage.getItem('comparisonSelection');
    console.log('ComparisonResultsPage - Session storage:', selection);
    console.log('ComparisonResultsPage - History length:', history.length);
    console.log('ComparisonResultsPage - History entries:', history.map(h => ({ id: h.id, status: h.status })));

    // Clear session storage on mount
    if (selection) {
      sessionStorage.removeItem('comparisonSelection');
    }
  }, []);

  // Convert history to snapshots
  const comparisonData: SimulationSnapshot[] = useMemo(() => {
    const result = selectedIds
      .map((id: string) => {
        const entry = history.find((h: any) => h.id === id);
        console.log(`Finding entry for id ${id}:`, entry ? `Found - ${entry.inputs.policyName}` : 'Not found');
        if (entry && entry.status === 'completed' && entry.results) {
          return {
            id: entry.id,
            entryId: entry.id,
            timestamp: entry.timestamp,
            inputs: entry.inputs,
            results: entry.results,
            isSelected: true,
          };
        }
        return null;
      })
      .filter(Boolean) as SimulationSnapshot[];

    console.log('ComparisonResultsPage - comparisonData:', result.length, 'snapshots');
    return result;
  }, [history, selectedIds]);

  const totalSnapshots = comparisonData.length;

  return (
    <div>
      <div className="flex items-center mb-6">
        <button onClick={() => window.location.hash = 'comparison'} className="p-2 rounded-full hover:bg-slate-200 mr-3">
          <BackIcon />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Comparison Results</h1>
          <p className="mt-1 text-sm text-slate-600">
            Comparing {totalSnapshots} policy simulations ({totalSnapshots}/5)
          </p>
        </div>
      </div>

      <div className="mb-6">
        <div className="bg-white p-1.5 rounded-lg border border-slate-200 shadow-sm inline-flex flex-wrap gap-1">
          {['summary', 'metrics', 'details'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              className={`px-4 py-2 text-sm font-medium rounded-md capitalize ${
                activeTab === tab
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-600 hover:bg-slate-200'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {activeTab === 'summary' && (
        <Card>
          <ComparisonSummary snapshots={comparisonData} />
        </Card>
      )}

      {activeTab === 'metrics' && (
        <div className="space-y-6">
          <div className="p-4 bg-blue-50 rounded">
            <h3 className="font-bold text-slate-800">Metrics Debug:</h3>
            <p>comparisonData.length: {comparisonData.length}</p>
            <p>comparisonData: {JSON.stringify(comparisonData)}</p>
            <p>Total simulations with detailedMetrics: {comparisonData.filter(s => s.results?.detailedMetrics?.length).length}</p>
          </div>

          {comparisonData.length < 2 ? (
            <Card>
              <p className="text-slate-500 text-center py-8">
                Select at least 2 simulations to compare metrics.
              </p>
            </Card>
          ) : (
            <>
              {comparisonData.flatMap(snapshot =>
                snapshot.results?.detailedMetrics || []
              )
              .filter((metric, index, self) =>
                index === self.findIndex(m => JSON.stringify(m) === JSON.stringify(metric))
              ).map((metric: Metric, idx: number) => (
                <Card key={idx}>
                  <ComparisonMetricChart
                    metric={metric}
                    snapshots={comparisonData}
                    showLegend={true}
                  />
                </Card>
              ))}
            </>
          )}
        </div>
      )}

      {activeTab === 'details' && (
        <div className="space-y-6">
          {comparisonData.map((snapshot) => (
            <Card key={snapshot.id}>
              <h2 className="text-xl font-bold mb-4 text-slate-800">
                {snapshot.inputs.policyName}
              </h2>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-xs text-slate-500">Economic Impact</p>
                  <p className={`text-2xl font-bold ${
                    snapshot.results?.economicImpact > 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {snapshot.results?.economicImpact > 0 ? '+' : ''}
                    {snapshot.results?.economicImpact.toFixed(1)}%
                  </p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <p className="text-xs text-slate-500">Social Impact</p>
                  <p className="text-2xl font-bold text-blue-600">
                    {snapshot.results?.socialImpact.toFixed(1)}/10
                  </p>
                </div>
                <div className="bg-yellow-50 p-4 rounded-lg">
                  <p className="text-xs text-slate-500">Environmental Impact</p>
                  <p className={`text-2xl font-bold ${
                    snapshot.results?.environmentalImpact > 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {snapshot.results?.environmentalImpact > 0 ? '+' : ''}
                    {snapshot.results?.environmentalImpact.toFixed(1)}%
                  </p>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg">
                  <p className="text-xs text-slate-500">Confidence</p>
                  <p className="text-2xl font-bold text-purple-600">
                    {snapshot.results?.confidence.toFixed(1)}%
                  </p>
                </div>
              </div>

              <div className="mb-4">
                <h3 className="font-semibold text-sm mb-2">AI Summary</h3>
                <p className="text-sm text-slate-600 bg-slate-50 p-3 rounded">
                  {snapshot.results?.summary || 'No summary available.'}
                </p>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
                <div>
                  <p className="text-xs text-slate-500">Policy Type</p>
                  <p className="text-sm font-medium">{snapshot.inputs.policyType}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500">Budget Allocation</p>
                  <p className="text-sm font-medium">
                    ₹{snapshot.inputs.parameters.budgetAllocation} Crores
                  </p>
                </div>
                <div>
                  <p className="text-xs text-slate-500">Target Coverage</p>
                  <p className="text-sm font-medium">
                    {snapshot.inputs.parameters.targetCoverage}%
                  </p>
                </div>
                <div>
                  <p className="text-xs text-slate-500">Timeline</p>
                  <p className="text-sm font-medium">
                    {snapshot.inputs.parameters.implementationTimeline}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-slate-500">Geographic Scope</p>
                  <p className="text-sm font-medium">
                    {snapshot.inputs.parameters.geographicScope}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-slate-500">Created</p>
                  <p className="text-sm font-medium">
                    {snapshot.timestamp.split(',')[0]}
                  </p>
                </div>
              </div>

              {snapshot.results?.detailedMetrics && snapshot.results.detailedMetrics.length > 0 && (
                <div>
                  <h3 className="font-semibold text-sm mb-2">Detailed Metrics</h3>
                  <div className="space-y-4">
                    {snapshot.results.detailedMetrics.map((metric, idx) => (
                      <div key={idx} className="border-t border-slate-200 pt-4">
                        {metric.type === 'line-chart' && (
                          <GenericLineChart
                            data={metric.data as any[]}
                            unit={metric.unit}
                            lines={metric.lines}
                          />
                        )}
                        {metric.type === 'bar-chart' && (
                          <GenericBarChart
                            data={metric.data as BarChartDataPoint[]}
                            unit={metric.unit}
                            color={metric.color}
                          />
                        )}
                        {metric.type === 'heatmap' && (
                          <WellBeingHeatmap data={metric.data as WellBeingData[]} />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </Card>
          ))}
        </div>
      )}

      <div className="mt-6 flex justify-center">
        <Button
          onClick={() => {
            window.location.hash = 'comparison';
            sessionStorage.removeItem('comparisonSelection');
          }}
          variant="secondary"
        >
          Return to Selection
        </Button>
      </div>
    </div>
  );
};

export default ComparisonResultsPage;
