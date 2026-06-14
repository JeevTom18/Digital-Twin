import React, { useState, useEffect, useCallback } from 'react';
import { UserRole, HistoryEntry } from './types';
import Login from './components/Login';
import MobileHeader from './components/MobileHeader';
import { useLocalStorage } from './hooks/useLocalStorage';

// Policymaker imports
import Sidebar from './components/Sidebar';
import DashboardPage from './pages/DashboardPage';
import PolicySimulatorPage from './pages/PolicySimulatorPage';
import ImpactAnalysisPage from './pages/ImpactAnalysisPage';
import StakeholderReportsPage from './pages/StakeholderReportsPage';
import HistoricalAnalysisPage from './pages/HistoricalAnalysisPage';
import ComparisonPage from './pages/ComparisonPage';
import ComparisonResultsPage from './pages/ComparisonResultsPage';

// Public user imports
import PublicSidebar from './components/public/PublicSidebar';
import PublicDashboardPage from './pages/public/PublicDashboardPage';
import PolicyExplorerPage from './pages/public/PolicyExplorerPage';
import PublicImpactAnalysisPage from './pages/public/PublicImpactAnalysisPage';
import ReportsLibraryPage from './pages/public/ReportsLibraryPage';
import LearnPage from './pages/public/LearnPage';

const App: React.FC = () => {
  const [user, setUser] = useState<UserRole | null>(null);
  const [page, setPage] = useState<string>('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [history, setHistory] = useLocalStorage<HistoryEntry[]>('simulationHistory', []);

  const navigate = useCallback((newPage: string) => {
    window.location.hash = newPage;
    setPage(newPage);
    setIsSidebarOpen(false);
  }, []);

  // Force re-render when history changes
  useEffect(() => {
    console.log('App: history changed, length:', history.length);
  }, [history]);

  // Debug: Show available simulations
  useEffect(() => {
    const completed = history.filter(h => h.status === 'completed' && h.results);
    console.log('Available simulations for comparison:', completed.length);
    completed.forEach(s => console.log(`- ${s.inputs.policyName}`));
  }, [history]);

  const handleLogin = (role: UserRole) => {
    setUser(role);
    if (role === UserRole.Policymaker) {
        window.location.hash = 'dashboard';
    } else {
        window.location.hash = 'public-dashboard';
    }
  };

  const handleLogout = () => {
    setUser(null);
    setIsSidebarOpen(false);
    window.location.hash = '';
  };

  const renderPolicymakerPage = () => {
    const policymakerPages = new Set(['dashboard', 'policy-simulator', 'impact-analysis', 'stakeholder-reports', 'historical-analysis', 'comparison', 'comparison-results']);
    if (!policymakerPages.has(page)) {
      return <DashboardPage userRole={user!} />;
    }

    switch (page) {
      case 'dashboard':
        return <DashboardPage userRole={user!} history={history} />;
      case 'policy-simulator':
        return <PolicySimulatorPage userRole={user!} setHistory={setHistory} history={history} />;
      case 'impact-analysis':
        return <ImpactAnalysisPage history={history} />;
      case 'stakeholder-reports':
        return <StakeholderReportsPage history={history} />;
      case 'historical-analysis':
        return <HistoricalAnalysisPage history={history} />;
      case 'comparison':
        return <ComparisonPage history={history} />;
      case 'comparison-results':
        return <ComparisonResultsPage history={history} />;
      default:
        return <DashboardPage userRole={user!} history={history} />;
    }
  };
  
  const renderPublicPage = () => {
    switch (page) {
      case 'public-dashboard':
        return <PublicDashboardPage />;
      case 'policy-explorer':
        return <PolicyExplorerPage />;
      case 'public-impact-analysis':
        return <PublicImpactAnalysisPage />;
      case 'reports-library':
        return <ReportsLibraryPage />;
      case 'learn':
        return <LearnPage />;
      default:
        // Fallback for any unknown or invalid hash for public users
        return <PublicDashboardPage />;
    }
  };


  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800">
      {!user ? (
        <Login onLogin={handleLogin} />
      ) : (
        <>
          {isSidebarOpen && (
            <div
              className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
              onClick={() => setIsSidebarOpen(false)}
              aria-hidden="true"
            ></div>
          )}
          {user === UserRole.Policymaker ? (
            <div className="flex min-h-screen">
              <Sidebar 
                userRole={user} 
                currentPage={page} 
                onNavigate={navigate} 
                onLogout={handleLogout}
                isSidebarOpen={isSidebarOpen}
              />
              <div className="flex-1 flex flex-col min-w-0">
                <MobileHeader onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
                <main className="flex-1 bg-slate-100 p-4 sm:p-6 lg:p-8 overflow-y-auto">
                  {renderPolicymakerPage()}
                </main>
              </div>
            </div>
          ) : (
            <div className="flex min-h-screen">
              <PublicSidebar 
                currentPage={page} 
                onNavigate={navigate} 
                onLogout={handleLogout} 
                isSidebarOpen={isSidebarOpen}
              />
              <div className="flex-1 flex flex-col min-w-0">
                <MobileHeader onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
                <main className="flex-1 bg-slate-100 p-4 sm:p-6 lg:p-8 overflow-y-auto">
                  {renderPublicPage()}
                </main>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default App;