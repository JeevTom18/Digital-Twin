import React from 'react';
import { Logo, LogoutIcon, HomeIcon, EyeIcon, BookOpenIcon, FileTextIcon, MessageSquareIcon } from '../icons';

interface PublicHeaderProps {
    currentPage: string;
    onLogout: () => void;
}

const NavLink: React.FC<{
  page: string;
  currentPage: string;
  icon: React.ReactNode;
  label: string;
}> = ({ page, currentPage, icon, label }) => {
  const isActive = currentPage === page;
  return (
    <a
      href={`#${page}`}
      className={`flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
        isActive ? 'bg-blue-100 text-blue-700' : 'text-slate-600 hover:bg-slate-200'
      }`}
    >
      <span className="mr-2">{icon}</span>
      {label}
    </a>
  );
};


const PublicHeader: React.FC<PublicHeaderProps> = ({ currentPage, onLogout }) => {
    return (
        <header className="sticky top-0 bg-white shadow-md z-50">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <div className="flex items-center">
                        <Logo className="w-9 h-9" />
                        <div className="ml-3 hidden sm:block">
                            <h1 className="text-base font-bold text-slate-800">DigiTwin of Democracy</h1>
                            <p className="text-xs text-slate-500">Public Portal</p>
                        </div>
                    </div>

                    <nav className="flex items-center space-x-2">
                        <NavLink page="welcome" currentPage={currentPage} icon={<HomeIcon />} label="Home" />
                        <NavLink page="impact-overview" currentPage={currentPage} icon={<EyeIcon />} label="Impact Overview" />
                        <NavLink page="learn" currentPage={currentPage} icon={<BookOpenIcon />} label="Learn" />
                        <NavLink page="reports" currentPage={currentPage} icon={<FileTextIcon />} label="Reports" />
                        <NavLink page="feedback" currentPage={currentPage} icon={<MessageSquareIcon />} label="Feedback" />
                    </nav>

                    <div className="flex items-center">
                         <p className="text-sm font-medium text-slate-700 mr-4 hidden md:block">Public User</p>
                         <button onClick={onLogout} className="text-slate-500 hover:text-slate-700 p-2 rounded-full hover:bg-slate-100">
                            <LogoutIcon />
                        </button>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default PublicHeader;