import React from 'react';
import { Logo, MenuIcon } from './icons';

interface MobileHeaderProps {
  onToggleSidebar: () => void;
}

const MobileHeader: React.FC<MobileHeaderProps> = ({ onToggleSidebar }) => {
  return (
    <header className="md:hidden sticky top-0 bg-white shadow-sm z-20 flex items-center justify-between p-4 border-b border-slate-200">
      <div className="flex items-center">
        <Logo className="w-8 h-8" />
        <span className="ml-2 font-bold text-slate-800">DigiTwin</span>
      </div>
      <button
        onClick={onToggleSidebar}
        className="p-2 rounded-md text-slate-500 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
        aria-label="Open sidebar"
      >
        <MenuIcon className="h-6 w-6" />
      </button>
    </header>
  );
};

export default MobileHeader;