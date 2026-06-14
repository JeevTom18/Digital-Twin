import React, { useState, useCallback, useEffect } from 'react';
import { UserRole, SimulationInput, SimulationResult, HistoryEntry, PolicyParameters, FineTuningParameters, Metric, LineChartDataPoint, BarChartDataPoint, WellBeingData, MultiLineChartDataPoint } from '../types';
import { simulatePolicyImpact } from '../services/geminiService';
import { useLocalStorage } from '../hooks/useLocalStorage';
import PageHeader from '../components/PageHeader';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import Select from '../components/ui/Select';
import Textarea from '../components/ui/Textarea';
import Button from '../components/ui/Button';
import Spinner from '../components/ui/Spinner';
import GenericLineChart from '../components/charts/FarmerIncomeChart';
import GenericBarChart from '../components/charts/InflationChart';
import WellBeingHeatmap from '../components/charts/WellBeingHeatmap';
import { BackIcon } from '../components/icons';
import Slider from '../components/ui/Slider';
import Toggle from '../components/ui/Toggle';
import ResultSummaryCard from '../components/ui/ResultSummaryCard';


interface PolicySimulatorPageProps {
  userRole: UserRole;
  setHistory: (value: HistoryEntry[] | ((val: HistoryEntry[]) => HistoryEntry[])) => void;
  history: HistoryEntry[];
}

const initialInputs: SimulationInput = {
    policyName: 'National Digital Health Mission',
    policyType: 'Healthcare & Family Welfare',
    policyDescription: 'Aims to create a national digital health ecosystem that supports universal health coverage in an efficient, accessible, inclusive, affordable, timely and safe manner.',
    parameters: {
        budgetAllocation: 15000,
        targetCoverage: 80,
        implementationTimeline: '3 years',
        geographicScope: 'National'
    },
    fineTuning: {
        economicModel: 'Neutral',
        socialAdoptionRate: 70,
        climateImpact: 10,
        marketVolatility: 30,
        blackSwanEvents: false
    }
};

const PolicySimulatorPage: React.FC<PolicySimulatorPageProps> = ({ userRole, setHistory }) => {
  const [activeTab, setActiveTab] = useState('configure');
  const [inputs, setInputs] = useState<SimulationInput>(initialInputs);
  const [results, setResults] = useState<SimulationResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);


  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (name in inputs) {
      setInputs(prev => ({ ...prev, [name]: value }));
    } else {
       setInputs(prev => ({
           ...prev,
           parameters: {
               ...prev.parameters,
               [name]: name === 'budgetAllocation' || name === 'targetCoverage' ? parseFloat(value) || 0 : value
           }
       }))
    }
  };

  const handleFineTuningChange = (name: string, value: string | number | boolean) => {
      setInputs(prev => ({
          ...prev,
          fineTuning: {
              ...(prev.fineTuning as FineTuningParameters),
              [name]: value
          }
      }))
  }

  const handleSimulate = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    setResults(null);
    setActiveTab('results');

    try {
      const simulationResult = await simulatePolicyImpact(inputs);
      setResults(simulationResult);

      const newHistoryEntry: HistoryEntry = {
        id: new Date().toISOString(),
        timestamp: new Date().toLocaleString(),
        status: 'completed',
        inputs,
        results: simulationResult,
      };
      setHistory(prevHistory => [newHistoryEntry, ...prevHistory.slice(0, 9)]);
      console.log('Simulation added to history:', simulationResult.summary);

    } catch (err: any) {
      setError(err.message || 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  }, [inputs, setHistory]);

  const TabButton = ({ tabName, label }: { tabName: string, label: string }) => (
    <button
        onClick={() => setActiveTab(tabName)}
        className={`px-4 py-2 text-sm font-medium rounded-md ${activeTab === tabName ? 'bg-blue-600 text-white' : 'text-slate-600 hover:bg-slate-200'}`}
    >
        {label}
    </button>
  );

  const renderMetric = (metric: Metric) => {
    switch (metric.type) {
        case 'line-chart':
            return <GenericLineChart data={metric.data as any[]} unit={metric.unit} lines={metric.lines} />;
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
        <div className="flex items-center mb-6">
            <button onClick={() => window.location.hash = 'dashboard'} className="p-2 rounded-full hover:bg-slate-200 mr-3">
                <BackIcon />
            </button>
            <div>
                <h1 className="text-2xl font-bold text-slate-900">Policy Simulator</h1>
                <p className="mt-1 text-sm text-slate-600">Configure and run policy impact simulations</p>
            </div>
        </div>
      
        <div className="mb-6">
            <div className="bg-white p-1.5 rounded-lg border border-slate-200 shadow-sm inline-flex flex-wrap gap-1">
                <TabButton tabName="configure" label="Configure Policy" />
                <TabButton tabName="finetune" label="Fine-tune Parameters" />
                <TabButton tabName="results" label="Simulation Results" />
            </div>
        </div>

        {activeTab === 'configure' && (
            <Card>
                <div className="space-y-6">
                    <Card>
                        <h3 className="text-lg font-semibold text-slate-800 mb-4">Policy Configuration</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                             <Input label="Policy Name *" name="policyName" value={inputs.policyName} onChange={handleInputChange} placeholder="e.g., Fertilizer Subsidy Reform 2024" />
                            <Select label="Policy Type *" name="policyType" value={inputs.policyType} onChange={handleInputChange}>
                                <option value="" disabled>Select policy type</option>
                                <option value="Agriculture & Rural Development">Agriculture & Rural Development</option>
                                <option value="Economic & Financial Policy">Economic & Financial Policy</option>
                                <option value="Education & Skilling">Education & Skilling</option>
                                <option value="Environment & Climate Change">Environment & Climate Change</option>
                                <option value="Healthcare & Family Welfare">Healthcare & Family Welfare</option>
                                <option value="Infrastructure & Urban Development">Infrastructure & Urban Development</option>
                                <option value="IT & Communications">IT & Communications</option>
                                <option value="Law & Justice">Law & Justice</option>
                                <option value="Science & Technology">Science & Technology</option>
                                <option value="Social Justice & Empowerment">Social Justice & Empowerment</option>
                                <option value="Foreign & Defense Policy">Foreign & Defense Policy</option>
                            </Select>
                        </div>
                        <div className="mt-6">
                           <Textarea label="Policy Description *" name="policyDescription" value={inputs.policyDescription} onChange={handleInputChange} placeholder="Describe the policy objectives, target beneficiaries, and key features..." />
                        </div>
                    </Card>
                    <Card>
                        <h3 className="text-lg font-semibold text-slate-800 mb-4">Policy Parameters</h3>
                         <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                             <Input label="Budget Allocation (₹ Crores) *" name="budgetAllocation" type="number" value={inputs.parameters.budgetAllocation} onChange={handleInputChange} placeholder="e.g., 50000" />
                            <Input label="Target Coverage (%) *" name="targetCoverage" type="number" value={inputs.parameters.targetCoverage} onChange={handleInputChange} placeholder="e.g., 75" />
                            <Select label="Implementation Timeline" name="implementationTimeline" value={inputs.parameters.implementationTimeline} onChange={handleInputChange}>
                                <option value="1 year">1 year</option>
                                <option value="2 years">2 years</option>
                                <option value="3 years">3 years</option>
                                <option value="5 years">5 years</option>
                            </Select>
                         </div>
                         <div className="mt-6">
                             <Select label="Geographic Scope" name="geographicScope" value={inputs.parameters.geographicScope} onChange={handleInputChange}>
                                <option value="National">National</option>
                                <option value="State-specific">State-specific</option>
                                <option value="Regional">Regional</option>
                            </Select>
                         </div>
                    </Card>
                </div>
                 <div className="mt-6 text-right">
                    <Button onClick={handleSimulate} disabled={isLoading}>
                      {isLoading ? 'Simulating...' : 'Run Simulation'}
                    </Button>
                </div>
            </Card>
        )}

        {activeTab === 'finetune' && (
             <Card>
                <h3 className="text-lg font-semibold text-slate-800 mb-4">Fine-tune Model Assumptions</h3>
                <p className="text-sm text-slate-500 mb-6">Adjust these advanced parameters to control the underlying assumptions of the AI simulation model. Changes here can significantly affect the outcome.</p>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                    <Select
                        label="Economic Model Assumption"
                        name="economicModel"
                        value={inputs.fineTuning?.economicModel}
                        onChange={(e) => handleFineTuningChange('economicModel', e.target.value)}
                    >
                        <option value="Optimistic">Optimistic Growth</option>
                        <option value="Neutral">Neutral Baseline</option>
                        <option value="Pessimistic">Pessimistic Outlook</option>
                    </Select>
                     <Toggle
                        label="Consider Black Swan Events"
                        name="blackSwanEvents"
                        checked={inputs.fineTuning?.blackSwanEvents || false}
                        onChange={(e) => handleFineTuningChange('blackSwanEvents', e.target.checked)}
                        description="Factor in the possibility of rare, high-impact, unpredictable events."
                     />
                     <Slider
                        label="Social Adoption Rate"
                        name="socialAdoptionRate"
                        value={inputs.fineTuning?.socialAdoptionRate || 0}
                        onChange={(e) => handleFineTuningChange('socialAdoptionRate', parseInt(e.target.value))}
                        description="How quickly the public is assumed to adopt or adapt to the new policy."
                        unit="%"
                     />
                     <Slider
                        label="Climate Change Impact"
                        name="climateImpact"
                        value={inputs.fineTuning?.climateImpact || 0}
                        onChange={(e) => handleFineTuningChange('climateImpact', parseInt(e.target.value))}
                        description="Severity of climate change events factored into the simulation."
                     />
                    <Slider
                        label="Market Volatility"
                        name="marketVolatility"
                        value={inputs.fineTuning?.marketVolatility || 0}
                        onChange={(e) => handleFineTuningChange('marketVolatility', parseInt(e.target.value))}
                        description="The assumed level of market stability or volatility during the period."
                    />
                 </div>
                 <div className="mt-8 text-right">
                    <Button onClick={handleSimulate} disabled={isLoading}>
                      {isLoading ? 'Simulating...' : 'Run Simulation with Fine-tuning'}
                    </Button>
                </div>
            </Card>
        )}
        
        {activeTab === 'results' && (
            <Card>
                <h2 className="text-xl font-bold mb-4 text-slate-800">Simulation Results</h2>
                <div className="min-h-[600px] flex flex-col justify-center items-center">
                    {isLoading && <Spinner />}
                    {error && <div className="text-red-600 bg-red-100 p-4 rounded-md w-full text-center">{error}</div>}
                    {!isLoading && !error && !results && (
                        <div className="text-center text-slate-500">
                            <p>Results will be displayed here after running a simulation.</p>
                        </div>
                    )}
                    {results && (
                        <div className="w-full space-y-8">
                            <Card className="bg-slate-50">
                                <h3 className="text-lg font-semibold mb-4">Overall Impact Scores</h3>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    <ResultSummaryCard label="Economic Impact" value={results.economicImpact > 0 ? `+${results.economicImpact}` : results.economicImpact} unit="%" />
                                    <ResultSummaryCard label="Social Impact" value={results.socialImpact} unit="/10" />
                                    <ResultSummaryCard label="Environmental Impact" value={results.environmentalImpact > 0 ? `+${results.environmentalImpact}` : results.environmentalImpact} unit="%" />
                                    <ResultSummaryCard label="Confidence" value={results.confidence} unit="%" />
                                </div>
                                <div className="mt-4">
                                    <h4 className="font-semibold text-sm mb-1">AI Summary:</h4>
                                    <p className="text-sm text-slate-600">{results.summary}</p>
                                </div>
                            </Card>
                            
                            {results.detailedMetrics.map((metric, index) => (
                                <Card key={index}>
                                    <h3 className="text-lg font-semibold mb-2">{metric.title}</h3>
                                    {metric.description && <p className="text-sm text-slate-500 mb-4">{metric.description}</p>}
                                    {renderMetric(metric)}
                                </Card>
                            ))}
                        </div>
                    )}
                </div>
            </Card>
        )}
    </div>
  );
};

export default PolicySimulatorPage;