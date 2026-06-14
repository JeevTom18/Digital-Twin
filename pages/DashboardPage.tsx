import React, { useMemo } from 'react';
import { UserRole, HistoryEntry } from '../types';
import { useLocalStorage } from '../hooks/useLocalStorage';
import PageHeader from '../components/PageHeader';
import RecentSimulations from '../components/RecentSimulations';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { PlusIcon, UsersIcon, WaveTrendIcon, TotalSimulationsIcon, ActiveSimulationsIcon, CompletedAnalysesIcon, UnderReviewIcon, ComparisonIcon } from '../components/icons';
import SummaryCard from '../components/SummaryCard';
import PolicyFeed from '../components/PolicyFeed';

interface DashboardProps {
  userRole: UserRole;
  history: HistoryEntry[];
}

const ImpactOverviewItem: React.FC<{label: string, value: string, color: string}> = ({label, value, color}) => (
    <div className={`flex justify-between items-center p-4 rounded-xl ${color}`}>
        <div>
            <span className="text-sm font-medium">{label}</span>
            <p className="font-bold text-2xl">{value}</p>
        </div>
        <WaveTrendIcon className="w-8 h-8 opacity-70" />
    </div>
);

const DashboardPage: React.FC<DashboardProps> = ({ userRole, history }) => {

    const loadFromHistory = (entry: HistoryEntry) => {
        sessionStorage.setItem('selectedSimulationId', entry.id);
        window.location.hash = 'policy-simulator';
    };

    const completedSimulations = useMemo(() => history.filter(h => h.status === 'completed' && h.results), [history]);
    const completedCount = completedSimulations.length;
    const activeCount = useMemo(() => history.filter(h => h.status === 'running').length, [history]);
    const underReviewCount = useMemo(() => history.filter(h => h.status === 'draft').length, [history]);


    const averages = useMemo(() => {
        if (completedCount === 0) {
            return { economic: 0, social: 0, environmental: 0 };
        }
        const totalEconomic = completedSimulations.reduce((sum, sim) => sum + (sim.results?.economicImpact || 0), 0);
        const totalSocial = completedSimulations.reduce((sum, sim) => sum + (sim.results?.socialImpact || 0), 0);
        const totalEnvironmental = completedSimulations.reduce((sum, sim) => sum + (sim.results?.environmentalImpact || 0), 0);
        
        return {
            economic: totalEconomic / completedCount,
            social: totalSocial / completedCount,
            environmental: totalEnvironmental / completedCount,
        };
    }, [completedSimulations, completedCount]);

    return (
        <div>
            <PageHeader
                title="Policy Simulation Dashboard"
                subtitle="DigiTwin of India's Democracy - Simulate before you legislate"
            >
              <div className="flex gap-2">
                <Button
                  onClick={() => window.location.hash = 'comparison'}
                  disabled={completedCount < 2}
                  variant="secondary"
                  icon={<ComparisonIcon />}
                >
                  Compare
                </Button>
                <Button onClick={() => window.location.hash = 'policy-simulator'} icon={<PlusIcon />}>
                    New Simulation
                </Button>
              </div>
            </PageHeader>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
                <SummaryCard
                    title="Total Simulations"
                    value={String(history.length)}
                    trend="+12% this month"
                    hasTrendIcon
                    icon={<TotalSimulationsIcon className="w-7 h-7" />}
                    color="blue"
                />
                <SummaryCard
                    title="Active Simulations"
                    value={String(activeCount)}
                    trend="Currently running"
                    icon={<ActiveSimulationsIcon className="w-7 h-7" />}
                    color="green"
                />
                <SummaryCard
                    title="Completed Analyses"
                    value={String(completedCount)}
                    trend="Ready for review"
                    icon={<CompletedAnalysesIcon className="w-7 h-7" />}
                    color="green"
                />
                <SummaryCard
                    title="Under Review"
                    value={String(underReviewCount)}
                    trend="Awaiting approval"
                    icon={<UnderReviewIcon className="w-7 h-7" />}
                    color="orange"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
                <div className="lg:col-span-2">
                    <RecentSimulations history={history} onSelect={loadFromHistory} />
                </div>
                <div className="space-y-6">
                    <Card>
                        <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center">
                            <UsersIcon className="w-5 h-5 mr-2 text-slate-500"/>
                            Impact Overview
                        </h2>
                        <div className="space-y-3">
                           <ImpactOverviewItem 
                                label="Economic Impact"
                                value={`${averages.economic > 0 ? '+' : ''}${averages.economic.toFixed(1)}%`}
                                color="bg-blue-100 text-blue-800"
                           />
                           <ImpactOverviewItem 
                                label="Social Impact"
                                value={`${averages.social.toFixed(1)}/10`}
                                color="bg-green-100 text-green-800"
                           />
                           <ImpactOverviewItem 
                                label="Environmental"
                                value={`${averages.environmental > 0 ? '+' : ''}${averages.environmental.toFixed(1)}%`}
                                color="bg-yellow-100 text-yellow-800"
                           />
                        </div>
                        {completedCount > 0 && (
                            <p className="text-xs text-slate-500 text-center mt-4">
                               Averaged across {completedCount} completed simulation{completedCount > 1 ? 's' : ''}
                            </p>
                        )}
                    </Card>
                    <PolicyFeed />
                </div>
            </div>
        </div>
    );
};

export default DashboardPage;