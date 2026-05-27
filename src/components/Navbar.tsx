import React from 'react';
import { ArrowLeft, Bell, ChevronDown, LayoutGrid } from 'lucide-react';
import { useAssignmentStore } from '../store/useAssignmentStore';

interface NavbarProps {
  onBack?: () => void;
  showBack?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({ onBack, showBack = false }) => {
  const { activeTab, setActiveTab, wizardStep } = useAssignmentStore();

  const handleBackClick = () => {
    if (onBack) {
      onBack();
    } else {
      setActiveTab('assignments');
    }
  };

  const getBreadcrumbTitle = () => {
    switch (activeTab) {
      case 'home':
        return 'Home';
      case 'groups':
        return 'My Groups';
      case 'assignments':
        if (showBack) return 'Create Assignment';
        return 'Assignment';
      case 'toolkit':
        return "AI Teacher's Toolkit";
      case 'library':
        return 'My Library';
      case 'settings':
        return 'Settings';
      default:
        return 'Assignment';
    }
  };

  return (
    <header className="h-[64px] bg-transparent flex items-center justify-between px-2 w-full select-none no-print">
      {/* Left section: Back and Breadcrumbs */}
      <div className="flex items-center gap-3">
        {(showBack || activeTab === 'toolkit') && (
          <button
            onClick={handleBackClick}
            className="w-10 h-10 rounded-full bg-white border border-neutral-100 flex items-center justify-center text-neutral-600 hover:text-black hover:shadow-sm active:scale-95 transition-all"
          >
            <ArrowLeft className="w-[18px] h-[18px]" />
          </button>
        )}
        
        <div className="flex items-center gap-2 px-3 py-1.5 bg-white border border-neutral-100 rounded-full shadow-sm">
          <LayoutGrid className="w-4 h-4 text-neutral-400" />
          <span className="text-[13px] font-medium text-neutral-400">
            {getBreadcrumbTitle()}
          </span>
        </div>
      </div>

      {/* Right section: Notifications & Profile */}
      <div className="flex items-center gap-4">
        {/* Notification Bell */}
        <button className="relative w-10 h-10 rounded-full bg-white border border-neutral-100 flex items-center justify-center text-neutral-600 hover:text-black hover:shadow-sm transition-all active:scale-95">
          <Bell className="w-[18px] h-[18px]" />
          {/* Active notification indicator */}
          <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-orange-500 rounded-full ring-2 ring-white" />
        </button>

        {/* User Profile */}
        <div className="flex items-center gap-2.5 bg-white border border-neutral-100 pl-2.5 pr-3 py-1.5 rounded-full shadow-sm hover:shadow-md transition-shadow cursor-pointer select-none">
          <div className="w-7 h-7 rounded-full bg-orange-100 overflow-hidden flex items-center justify-center border border-orange-200">
            <span className="text-xs font-bold text-orange-700">JD</span>
          </div>
          <span className="text-[13px] font-semibold text-neutral-800">
            John Doe
          </span>
          <ChevronDown className="w-3.5 h-3.5 text-neutral-400" />
        </div>
      </div>
    </header>
  );
};
