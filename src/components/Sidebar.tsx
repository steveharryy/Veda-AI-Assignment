import React from 'react';
import { useAssignmentStore, TabType } from '../store/useAssignmentStore';
import { 
  Home, 
  Users, 
  FileText, 
  BrainCircuit, 
  FolderHeart, 
  Settings, 
  Sparkles, 
  ChevronRight
} from 'lucide-react';
import { motion } from 'framer-motion';

interface SidebarProps {
  onStartWizard: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ onStartWizard }) => {
  const { activeTab, setActiveTab, assignments, resetWizardForm } = useAssignmentStore();

  const navItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'groups', label: 'My Groups', icon: Users },
    { id: 'assignments', label: 'Assignments', icon: FileText, badge: assignments.length || null },
    { id: 'toolkit', label: "AI Teacher's Toolkit", icon: BrainCircuit, badge: 32 },
    { id: 'library', label: 'My Library', icon: FolderHeart },
  ];

  const handleNavClick = (tabId: TabType) => {
    setActiveTab(tabId);
    if (tabId === 'toolkit') {
      // Direct access to Question paper
    }
  };

  const handleCreateClick = () => {
    resetWizardForm();
    onStartWizard();
  };

  return (
    <aside className="w-[280px] h-[calc(100vh-24px)] bg-white rounded-[24px] p-6 shadow-sm border border-neutral-100 flex flex-col justify-between sidebar-shadow select-none no-print">
      <div className="flex flex-col gap-8">
        {/* Logo VedaAI */}
        <div className="flex items-center gap-2.5 px-2">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-orange-600 to-red-500 flex items-center justify-center text-white font-black text-xl shadow-md shadow-orange-500/20">
            V
          </div>
          <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-neutral-900 to-neutral-700 bg-clip-text text-transparent">
            VedaAI
          </span>
        </div>

        {/* Create Assignment CTA */}
        <button
          onClick={handleCreateClick}
          className="w-full bg-neutral-900 hover:bg-neutral-800 text-white font-medium text-[15px] h-[52px] rounded-full flex items-center justify-center gap-2 shadow-lg shadow-neutral-950/10 transition-all active:scale-[0.98]"
        >
          <Sparkles className="w-4 h-4 text-orange-400" />
          <span>Create Assignment</span>
        </button>

        {/* Navigation Items */}
        <nav className="flex flex-col gap-1.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id as TabType)}
                className={`relative w-full h-[48px] px-4 rounded-xl flex items-center justify-between transition-all group ${
                  isActive 
                    ? 'text-neutral-900 font-semibold' 
                    : 'text-neutral-500 hover:text-neutral-900 hover:bg-neutral-50'
                }`}
              >
                {/* Active background pill */}
                {isActive && (
                  <motion.div
                    layoutId="activeTabBg"
                    className="absolute inset-0 bg-neutral-100 rounded-xl -z-10"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
                
                <div className="flex items-center gap-3">
                  <Icon className={`w-[18px] h-[18px] transition-transform group-hover:scale-105 ${
                    isActive ? 'text-black' : 'text-neutral-400'
                  }`} />
                  <span className="text-[14px]">{item.label}</span>
                </div>

                {item.badge !== null && (
                  <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                    isActive 
                      ? 'bg-orange-500 text-white shadow-sm shadow-orange-500/20' 
                      : 'bg-neutral-100 text-neutral-600'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      <div className="flex flex-col gap-4">
        {/* Settings button */}
        <button
          onClick={() => handleNavClick('settings')}
          className={`w-full h-[44px] px-4 rounded-xl flex items-center gap-3 text-[14px] transition-all group ${
            activeTab === 'settings' 
              ? 'text-neutral-900 font-semibold bg-neutral-100' 
              : 'text-neutral-500 hover:text-neutral-900 hover:bg-neutral-50'
          }`}
        >
          <Settings className="w-[18px] h-[18px] text-neutral-400 group-hover:rotate-45 transition-transform" />
          <span>Settings</span>
        </button>

        {/* Profile Card Footer */}
        <div className="p-3 bg-neutral-50 border border-neutral-100 rounded-2xl flex items-center gap-3">
          <div className="relative w-10 h-10 rounded-xl overflow-hidden bg-orange-100 flex items-center justify-center font-bold text-lg text-orange-600 shadow-inner">
            🏫
          </div>
          <div className="flex flex-col overflow-hidden">
            <span className="text-[13px] font-semibold text-neutral-800 truncate leading-tight">
              Delhi Public School
            </span>
            <span className="text-[11px] text-neutral-400 truncate mt-0.5">
              Bokaro Steel City
            </span>
          </div>
        </div>
      </div>
    </aside>
  );
};
