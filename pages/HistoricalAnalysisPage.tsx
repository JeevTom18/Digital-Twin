import React, { useState, useMemo } from 'react';
import PageHeader from '../components/PageHeader';
import Card from '../components/ui/Card';
import Select from '../components/ui/Select';
import { LightbulbIcon, SimulatorIcon } from '../components/icons';
import { HistoryEntry, SimulationResult } from '../types';
import { useLocalStorage } from '../hooks/useLocalStorage';
import ResultSummaryCard from '../components/ui/ResultSummaryCard';
import Button from '../components/ui/Button';

const generateLessons = (results: SimulationResult): string[] => {
    const lessons: string[] = [];
    if (results.economicImpact > 2) {
        lessons.push('Policy shows strong potential for economic stimulus and GDP growth.');
    } else if (results.economicImpact < 0) {
        lessons.push('The economic model suggests potential fiscal drag or contraction; review funding mechanisms.');
    } else {
        lessons.push('Moderate economic impact; benefits might be targeted rather than broad-based.');
    }

    if (results.socialImpact > 7) {
        lessons.push('High social impact score indicates significant improvements in citizen well-being and equity.');
    } else if (results.socialImpact < 4) {
        lessons.push('Social impact is lower than desired; consider refining the policy to better address vulnerable populations.');
    }

    if (results.environmentalImpact < -2) {
        lessons.push('Significant negative environmental externalities were predicted. Mitigation strategies are crucial.');
    } else if (results.environmentalImpact > 2) {
        lessons.push('The policy has strong co-benefits for environmental sustainability.');
    }
    
    if (results.confidence < 85) {
        lessons.push('Lower confidence score suggests high uncertainty. Consider a phased rollout or more pilot programs.');
    }

    return lessons.slice(0, 3);
};


const HistoricalAnalysisPage: React.FC = () => {
  const [history] = useLocalStorage<HistoryEntry[]>('simulationHistory', []);
  
  const completedSimulations = useMemo(() => history.filter(h => h.status === 'completed' && h.results), [history]);
  
  const [selectedPolicyId, setSelectedPolicyId] = useState(completedSimulations.length > 0 ? completedSimulations[0].id : '');

  const selectedPolicy = completedSimulations.find(p => p.id === selectedPolicyId);
  const lessons = selectedPolicy && selectedPolicy.results ? generateLessons(selectedPolicy.results) : [];

  const handleLoadInSimulator = () => {
    if (selectedPolicy) {
        sessionStorage.setItem('selectedSimulationId', selectedPolicy.id);
        window.location.hash = 'policy-simulator';
    }
  };

  return (
    <div>
      <PageHeader
        title="Historical Analysis"
        subtitle="Learn from past policies to improve future simulations"
      />
      <Card className="mb-6">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between">
            <Select
                label="Select Historical Simulation:"
                name="historicalPolicy"
                value={selectedPolicyId}
                onChange={e => setSelectedPolicyId(e.target.value)}
                className="w-full sm:w-96"
            >
                {completedSimulations.length === 0 && <option>No completed simulations</option>}
                {completedSimulations.map(policy => (
                    <option key={policy.id} value={policy.id}>{policy.inputs.policyName}</option>
                ))}
            </Select>
            {selectedPolicy && (
                <div className="mt-4 sm:mt-0">
                    <Button onClick={handleLoadInSimulator} icon={<SimulatorIcon />} variant="secondary">
                        Load in Simulator
                    </Button>
                </div>
            )}
        </div>
      </Card>
      
      {selectedPolicy && selectedPolicy.results ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
                 <h3 className="text-lg font-bold text-slate-800 mb-4">Overall Impact Scores</h3>
                 <div className="grid grid-cols-2 gap-4">
                    <ResultSummaryCard label="Economic Impact" value={selectedPolicy.results.economicImpact > 0 ? `+${selectedPolicy.results.economicImpact}` : selectedPolicy.results.economicImpact} unit="%" />
                    <ResultSummaryCard label="Social Impact" value={selectedPolicy.results.socialImpact} unit="/10" />
                    <ResultSummaryCard label="Environmental Impact" value={selectedPolicy.results.environmentalImpact > 0 ? `+${selectedPolicy.results.environmentalImpact}` : selectedPolicy.results.environmentalImpact} unit="%" />
                    <ResultSummaryCard label="Confidence" value={selectedPolicy.results.confidence} unit="%" />
                </div>
                 <div className="mt-6">
                    <h4 className="font-semibold text-sm mb-2">AI Summary:</h4>
                    <p className="text-sm text-slate-600 bg-slate-50 p-3 rounded-md">{selectedPolicy.results.summary}</p>
                </div>
            </Card>
            <Card>
                <h3 className="text-lg font-bold text-slate-800 mb-4">Key Lessons Learned</h3>
                <ul className="space-y-4">
                    {lessons.map((lesson, index) => (
                        <li key={index} className="flex items-start p-3 bg-yellow-50 rounded-lg">
                            <div className="flex-shrink-0 text-yellow-500 mt-1">
                                <LightbulbIcon />
                            </div>
                            <p className="ml-3 text-sm text-yellow-900">{lesson}</p>
                        </li>
                    ))}
                </ul>
            </Card>
        </div>
      ) : (
         <Card>
            <div className="text-center py-20">
            <h3 className="text-lg font-semibold text-slate-700">No Simulation Selected</h3>
            <p className="text-sm text-slate-500 mt-2">Select a completed simulation from the dropdown to view its analysis.</p>
            </div>
        </Card>
      )}
    </div>
  );
};

export default HistoricalAnalysisPage;
