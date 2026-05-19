import React, { useState } from 'react';
import PageHeader from '../../components/PageHeader';
import Card from '../../components/ui/Card';
import { PredefinedScenario, Metric, LineChartDataPoint, BarChartDataPoint, WellBeingData } from '../../types';
import { MOCK_PREDEFINED_SCENARIOS } from '../../utils/mockData';
import ResultSummaryCard from '../../components/ui/ResultSummaryCard';
import GenericLineChart from '../../components/charts/FarmerIncomeChart';
import GenericBarChart from '../../components/charts/InflationChart';
import WellBeingHeatmap from '../../components/charts/WellBeingHeatmap';

const ImpactOverviewPage: React.FC = () => {
    const [selectedScenario, setSelectedScenario] = useState<PredefinedScenario | null>(MOCK_PREDEFINED_SCENARIOS[0]);

    const renderMetric = (metric: Metric) => {
        switch (metric.type) {
            case 'line-chart':
                return <GenericLineChart data={metric.data as LineChartDataPoint[]} unit={metric.unit} />;
            case 'bar-chart':
                return <GenericBarChart data={metric.data as BarChartDataPoint[]} unit={metric.unit} />;
            case 'heatmap':
                return <WellBeingHeatmap data={metric.data as WellBeingData[]} />;
            default:
                return <p>Unsupported chart type</p>;
        }
    }

    return (
        <div>
            <PageHeader
                title="Policy Impact Overview"
                subtitle="Explore predefined scenarios to understand potential policy outcomes."
            />

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                <div className="lg:col-span-1">
                    <Card>
                        <h3 className="font-bold text-slate-800 mb-4">Select a Scenario</h3>
                        <ul className="space-y-2">
                            {MOCK_PREDEFINED_SCENARIOS.map(scenario => (
                                <li key={scenario.id}>
                                    <button
                                        onClick={() => setSelectedScenario(scenario)}
                                        className={`w-full text-left p-3 rounded-md text-sm transition-colors ${
                                            selectedScenario?.id === scenario.id
                                                ? 'bg-blue-100 text-blue-800 font-semibold'
                                                : 'text-slate-700 hover:bg-slate-100'
                                        }`}
                                    >
                                        {scenario.title}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </Card>
                </div>
                <div className="lg:col-span-3">
                    {selectedScenario ? (
                         <Card>
                            <h2 className="text-xl font-bold mb-2 text-slate-800">{selectedScenario.title}</h2>
                            <p className="text-sm text-slate-600 mb-6">{selectedScenario.description}</p>
                            
                             <div className="w-full space-y-8">
                                <Card className="bg-slate-50">
                                    <h3 className="text-lg font-semibold mb-4">Overall Impact Scores</h3>
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                        <ResultSummaryCard label="Economic Impact" value={selectedScenario.results.economicImpact > 0 ? `+${selectedScenario.results.economicImpact}` : selectedScenario.results.economicImpact} unit="%" />
                                        <ResultSummaryCard label="Social Impact" value={selectedScenario.results.socialImpact} unit="/10" />
                                        <ResultSummaryCard label="Environmental Impact" value={selectedScenario.results.environmentalImpact > 0 ? `+${selectedScenario.results.environmentalImpact}` : selectedScenario.results.environmentalImpact} unit="%" />
                                        <ResultSummaryCard label="Confidence" value={selectedScenario.results.confidence} unit="%" />
                                    </div>
                                    <div className="mt-4">
                                        <h4 className="font-semibold text-sm mb-1">AI Summary:</h4>
                                        <p className="text-sm text-slate-600">{selectedScenario.results.summary}</p>
                                    </div>
                                </Card>
                                
                                {selectedScenario.results.detailedMetrics.map((metric, index) => (
                                    <Card key={index}>
                                        <h3 className="text-lg font-semibold mb-2">{metric.title}</h3>
                                        {metric.description && <p className="text-sm text-slate-500 mb-4">{metric.description}</p>}
                                        {renderMetric(metric)}
                                    </Card>
                                ))}
                            </div>
                        </Card>
                    ) : (
                         <Card>
                            <div className="text-center py-20 text-slate-500">
                                <p>Select a scenario from the left to view its details.</p>
                            </div>
                        </Card>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ImpactOverviewPage;