import React, { useState, useMemo } from 'react';
import PageHeader from '../../components/PageHeader';
import Card from '../../components/ui/Card';
import { PredefinedScenario, Metric, LineChartDataPoint, BarChartDataPoint, WellBeingData, PolicyScenarioCategory } from '../../types';
import { MOCK_EXPLORER_SCENARIOS } from '../../utils/mockData';
import ResultSummaryCard from '../../components/ui/ResultSummaryCard';
import GenericLineChart from '../../components/charts/FarmerIncomeChart';
import GenericBarChart from '../../components/charts/InflationChart';
import WellBeingHeatmap from '../../components/charts/WellBeingHeatmap';

const PolicyExplorerPage: React.FC = () => {
    const categories: PolicyScenarioCategory[] = MOCK_EXPLORER_SCENARIOS;
    const [selectedPolicyType, setSelectedPolicyType] = useState<string | null>(categories[0]?.policyType || null);

    const scenariosForSelectedType = useMemo(() => {
        if (!selectedPolicyType) return [];
        return categories.find(cat => cat.policyType === selectedPolicyType)?.scenarios || [];
    }, [selectedPolicyType, categories]);

    const [selectedScenario, setSelectedScenario] = useState<PredefinedScenario | null>(scenariosForSelectedType[0] || null);

    const handlePolicyTypeSelect = (policyType: string) => {
        setSelectedPolicyType(policyType);
        const newScenarios = categories.find(cat => cat.policyType === policyType)?.scenarios || [];
        setSelectedScenario(newScenarios[0] || null); // Auto-select the first scenario of the new category
    };

    const renderMetric = (metric: Metric) => {
        switch (metric.type) {
            case 'line-chart':
                return <GenericLineChart data={metric.data as LineChartDataPoint[]} unit={metric.unit} lines={metric.lines} />;
            case 'bar-chart':
                return <GenericBarChart data={metric.data as BarChartDataPoint[]} unit={metric.unit} color={metric.color} />;
            case 'heatmap':
                return <WellBeingHeatmap data={metric.data as WellBeingData[]} />;
            default:
                return <p>Unsupported chart type</p>;
        }
    }

    return (
        <div>
            <PageHeader
                title="Policy Explorer"
                subtitle="View visualizations of pre-defined policy scenarios."
            />

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                <div className="lg:col-span-1">
                    <Card>
                        <h3 className="font-bold text-slate-800 mb-4">1. Select a Policy Area</h3>
                        <div className="space-y-3">
                            {categories.map(category => (
                                <div
                                    key={category.policyType}
                                    onClick={() => handlePolicyTypeSelect(category.policyType)}
                                    className={`w-full text-left p-4 rounded-lg cursor-pointer transition-all border-2 ${
                                        selectedPolicyType === category.policyType
                                            ? 'bg-blue-50 border-blue-500 shadow-md'
                                            : 'bg-white border-slate-200 hover:border-blue-400 hover:bg-slate-50'
                                    }`}
                                >
                                    <h4 className={`font-semibold text-sm ${selectedPolicyType === category.policyType ? 'text-blue-800' : 'text-slate-800'}`}>
                                        {category.policyType}
                                    </h4>
                                    <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                                        {category.description}
                                    </p>
                                </div>
                            ))}
                        </div>

                        {selectedPolicyType && (
                             <>
                                <h3 className="font-bold text-slate-800 mt-6 mb-4">2. Select a Scenario</h3>
                                <div className="space-y-2 max-h-[40vh] overflow-y-auto pr-2">
                                     {scenariosForSelectedType.map(scenario => (
                                        <button
                                            key={scenario.id}
                                            onClick={() => setSelectedScenario(scenario)}
                                            className={`w-full text-left p-3 rounded-md text-sm transition-colors ${
                                                selectedScenario?.id === scenario.id
                                                    ? 'bg-blue-100 text-blue-800 font-semibold'
                                                    : 'text-slate-700 hover:bg-slate-100'
                                            }`}
                                        >
                                            {scenario.title}
                                        </button>
                                    ))}
                                    {scenariosForSelectedType.length === 0 && (
                                        <p className="text-sm text-slate-500 p-3">No scenarios available for this area.</p>
                                    )}
                                </div>
                            </>
                        )}
                    </Card>
                </div>
                <div className="lg:col-span-3">
                    {selectedScenario && selectedScenario.results ? (
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
                                <p>Select a policy area and then a scenario to view its detailed results.</p>
                                {categories.length === 0 && <p className="mt-2 text-sm">There are no policy areas available at the moment.</p>}
                            </div>
                        </Card>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PolicyExplorerPage;