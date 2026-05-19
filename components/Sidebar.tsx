import React from 'react';
import { UserRole } from '../types';
import { Logo, DashboardIcon, SimulatorIcon, ImpactIcon, StakeholderIcon, HistoryIcon, LogoutIcon } from './icons';

interface SidebarProps {
  userRole: UserRole | null;
  currentPage: string;
  onNavigate: (page: string) => void;
  onLogout: () => void;
  isSidebarOpen: boolean;
}

const NavLink: React.FC<{
  page: string;
  currentPage: string;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
}> = ({ page, currentPage, onClick, icon, label }) => {
  const isActive = currentPage === page;
  return (
    <li>
      <a
        href={`#${page}`}
        onClick={(e) => { e.preventDefault(); onClick(); }}
        className={`flex items-center px-3 py-2.5 text-sm font-medium rounded-md transition-colors ${
          isActive
            ? 'bg-blue-600 text-white'
            : 'text-slate-600 hover:bg-slate-200'
        }`}
      >
        <span className="mr-3">{icon}</span>
        {label}
      </a>
    </li>
  );
};

const Sidebar: React.FC<SidebarProps> = ({ userRole, currentPage, onNavigate, onLogout, isSidebarOpen }) => {
  const navItems = [
    { page: 'dashboard', icon: <DashboardIcon />, label: 'Dashboard' },
    { page: 'policy-simulator', icon: <SimulatorIcon />, label: 'Policy Simulator' },
    { page: 'impact-analysis', icon: <ImpactIcon />, label: 'Impact Analysis' },
    { page: 'stakeholder-reports', icon: <StakeholderIcon />, label: 'Stakeholder Reports' },
    { page: 'historical-analysis', icon: <HistoryIcon />, label: 'Historical Analysis' },
  ];

  return (
    <aside className={`fixed inset-y-0 left-0 z-40 w-64 bg-white border-r border-slate-200 flex flex-col transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0 md:flex-shrink-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
      <div className="p-3">
        <div className="flex items-center p-3 rounded-lg bg-blue-900">
            <Logo className="w-10 h-10" />
            <div className="ml-3">
                <h1 className="text-lg font-bold text-white">DigiTwin</h1>
                <p className="text-sm text-slate-300">Democracy Platform</p>
            </div>
        </div>
      </div>
      
      <nav className="flex-1 p-4 space-y-2">
        <p className="px-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">Navigation</p>
        <ul>
            {navItems.map(item => (
                <NavLink 
                    key={item.page}
                    page={item.page}
                    currentPage={currentPage}
                    onClick={() => onNavigate(item.page)}
                    icon={item.icon}
                    label={item.label}
                />
            ))}
        </ul>
      </nav>
      
      <div className="p-4 border-t border-slate-200">
          <div className="px-3 py-2">
             <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Platform Status</p>
              <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center text-slate-600">
                    <span className="w-2 h-2 rounded-full bg-green-500 mr-2"></span>
                    System Active
                  </div>
              </div>
               <div className="flex items-center justify-between text-sm mt-1">
                  <div className="flex items-center text-slate-600">
                     <span className="w-2 h-2 rounded-full bg-slate-300 mr-2"></span>
                     Simulations
                  </div>
                   <span className="font-semibold text-slate-700">12</span>
              </div>
          </div>
      </div>

      <div className="p-4 border-t border-slate-200">
        <div className="flex items-center">
            <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center font-bold text-slate-600">
                {userRole === UserRole.Policymaker ? 'GU' : 'PU'}
            </div>
            <div className="ml-3 flex-1">
                <p className="text-sm font-semibold text-slate-800">{userRole}</p>
                <p className="text-xs text-slate-500">
                    {userRole === UserRole.Policymaker ? 'Policy Analysis Team' : 'Public Access'}
                </p>
            </div>
            <button onClick={onLogout} className="text-slate-500 hover:text-slate-700">
                <LogoutIcon />
            </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;