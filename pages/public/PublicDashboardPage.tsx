import React from 'react';
import PageHeader from '../../components/PageHeader';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { HistoryEntry } from '../../types';
import { MOCK_EXPLORER_SCENARIOS } from '../../utils/mockData';

const PublicDashboardPage: React.FC = () => {
    const [history] = useLocalStorage<HistoryEntry[]>('simulationHistory', []);
    const completedSimulations = history.filter(h => h.status === 'completed');
    const totalScenarios = MOCK_EXPLORER_SCENARIOS.reduce((sum, category) => sum + category.scenarios.length, 0);

    return (
        <div>
            <PageHeader
                title="Public Dashboard"
                subtitle="Welcome to the Digital Twin of Democracy Public Portal"
            />
            
            <Card className="mb-6">
                <div className="text-center p-4">
                    <h2 className="text-2xl font-bold text-slate-800">Explore and Understand Policy Making</h2>
                    <p className="mt-2 max-w-3xl mx-auto text-slate-600">
                        This platform uses AI to simulate the potential impact of government policies. Browse through completed simulations to see how data can help shape a better future for India.
                    </p>
                </div>
            </Card>

            <div className="grid md:grid-cols-3 gap-6 mt-6">
                <Card>
                    <h3 className="font-bold text-lg mb-2">Published Reports</h3>
                    <p className="text-4xl font-bold text-slate-900">{completedSimulations.length}</p>
                    <p className="text-sm text-slate-600 mt-1">Simulation reports are available for public view in the Reports Library.</p>
                     <Button variant="secondary" onClick={() => window.location.hash = 'reports-library'} className="mt-4 text-sm">
                        View Reports
                    </Button>
                </Card>
                 <Card>
                    <h3 className="font-bold text-lg mb-2">Pre-defined Scenarios</h3>
                    <p className="text-4xl font-bold text-slate-900">{totalScenarios}</p>
                    <p className="text-sm text-slate-600 mt-1">Explore "what-if" scenarios to understand complex policy trade-offs.</p>
                     <Button variant="secondary" onClick={() => window.location.hash = 'policy-explorer'} className="mt-4 text-sm">
                        Explore Scenarios
                    </Button>
                </Card>
                 <Card>
                    <h3 className="font-bold text-lg mb-2">Learn More</h3>
                    <p className="text-sm text-slate-600 mt-4">New to policy simulation? Our learning center has FAQs and simple explanations of key concepts to get you started.</p>
                     <Button variant="secondary" onClick={() => window.location.hash = 'learn'} className="mt-4 text-sm">
                        Go to Learning Center
                    </Button>
                </Card>
            </div>
        </div>
    );
};

export default PublicDashboardPage;