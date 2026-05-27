'use client';

import React, { useState, useEffect } from 'react';
import { useAssignmentStore, TabType } from '../store/useAssignmentStore';
import { Sidebar } from '../components/Sidebar';
import { Navbar } from '../components/Navbar';
import { EmptyState } from '../components/EmptyState';
import { AssignmentsList } from '../components/AssignmentsList';
import { CreateAssignmentWizard } from '../components/CreateAssignmentWizard';
import { QuestionPaperView } from '../components/QuestionPaperView';
import { CardGridSkeleton } from '../components/LoadingSkeleton';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  TrendingUp, 
  Users, 
  Award, 
  CalendarDays, 
  Clock, 
  ChevronRight, 
  Sparkles,
  BookOpen,
  PieChart as ChartIcon
} from 'lucide-react';

export default function Home() {
  const { 
    activeTab, 
    setActiveTab, 
    assignments, 
    wizardStep, 
    setWizardStep, 
    resetWizardForm,
    isSkeletonLoading,
    setIsSkeletonLoading
  } = useAssignmentStore();

  const [inWizardFlow, setInWizardFlow] = useState(false);

  // Trigger brief skeletons when tab changes to simulate data loading
  useEffect(() => {
    setIsSkeletonLoading(true);
    const timer = setTimeout(() => {
      setIsSkeletonLoading(false);
    }, 450);
    return () => clearTimeout(timer);
  }, [activeTab, inWizardFlow, setIsSkeletonLoading]);

  const handleStartWizard = () => {
    resetWizardForm();
    setInWizardFlow(true);
    setActiveTab('assignments');
  };

  const handleCompleteWizard = () => {
    setInWizardFlow(false);
    setActiveTab('toolkit'); // Automatically navigate to the AI Generated Paper view
  };

  const handleCancelWizard = () => {
    setInWizardFlow(false);
    setWizardStep(1);
  };

  const handleViewPaperDirectly = () => {
    setInWizardFlow(false);
    setActiveTab('toolkit');
  };

  const handleBackToAssignments = () => {
    setInWizardFlow(false);
    setWizardStep(1);
    setActiveTab('assignments');
  };

  // Render content based on activeTab and flow
  const renderMainContent = () => {
    if (isSkeletonLoading) {
      return (
        <div className="w-full py-8">
          <CardGridSkeleton />
        </div>
      );
    }

    if (activeTab === 'assignments') {
      if (inWizardFlow) {
        return (
          <CreateAssignmentWizard 
            onComplete={handleCompleteWizard} 
            onCancel={handleCancelWizard} 
          />
        );
      }
      
      if (assignments.length === 0) {
        return <EmptyState onStartWizard={handleStartWizard} />;
      }
      
      return (
        <AssignmentsList 
          onStartWizard={handleStartWizard} 
          onViewPaper={handleViewPaperDirectly} 
        />
      );
    }

    if (activeTab === 'toolkit') {
      return <QuestionPaperView onBack={handleBackToAssignments} />;
    }

    // Dynamic premium mock views for other tabs to make dashboard complete and stunning
    return renderMockTabContent();
  };

  // Helper to render premium placeholders for non-primary tabs
  const renderMockTabContent = () => {
    const title = activeTab.charAt(0).toUpperCase() + activeTab.slice(1);
    
    return (
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col gap-6 w-full"
      >
        <div>
          <h1 className="text-2xl font-bold text-neutral-900 tracking-tight">{title === 'Groups' ? 'My Groups' : title === 'Library' ? 'My Library' : title}</h1>
          <p className="text-neutral-500 text-[13px] mt-0.5">Explore real-time telemetry, reports, and AI analytics.</p>
        </div>

        {/* Analytics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
          <div className="bg-white rounded-[24px] p-6 border border-neutral-100 shadow-sm card-shadow flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-orange-50 flex items-center justify-center text-orange-600">
              <TrendingUp className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[12px] font-bold text-neutral-400 uppercase tracking-wider block">Average Grade</span>
              <span className="text-2xl font-black text-neutral-800">A- (88%)</span>
            </div>
          </div>

          <div className="bg-white rounded-[24px] p-6 border border-neutral-100 shadow-sm card-shadow flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-sky-50 flex items-center justify-center text-sky-600">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[12px] font-bold text-neutral-400 uppercase tracking-wider block">Active Students</span>
              <span className="text-2xl font-black text-neutral-800">142 Pupils</span>
            </div>
          </div>

          <div className="bg-white rounded-[24px] p-6 border border-neutral-100 shadow-sm card-shadow flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[12px] font-bold text-neutral-400 uppercase tracking-wider block">Assessments Run</span>
              <span className="text-2xl font-black text-neutral-800">18 Papers</span>
            </div>
          </div>
        </div>

        {/* Under construction graphics card */}
        <div className="bg-white rounded-[24px] p-8 border border-neutral-100 card-shadow flex flex-col items-center justify-center min-h-[300px] text-center">
          <div className="w-14 h-14 rounded-2xl bg-neutral-50 flex items-center justify-center border border-neutral-200/60 shadow-inner mb-4">
            <Sparkles className="w-6 h-6 text-orange-500" />
          </div>
          <h2 className="text-lg font-bold text-neutral-800">VedaAI {title} Matrix</h2>
          <p className="text-sm text-neutral-500 max-w-sm mt-2 leading-relaxed">
            This module is currently collecting assessment criteria. Start generating questions in the Assignments tab to populate analytics graphs!
          </p>
          <button
            onClick={handleStartWizard}
            className="mt-6 h-[44px] px-6 rounded-full bg-black hover:bg-neutral-800 text-white font-semibold text-xs transition-colors active:scale-95 shadow"
          >
            Create New Assessment
          </button>
        </div>
      </motion.div>
    );
  };

  return (
    <div className="flex p-3 gap-6 h-screen w-screen overflow-hidden">
      {/* Sidebar fixed on Left */}
      <Sidebar onStartWizard={handleStartWizard} />

      {/* Main content scrollable on Right */}
      <div className="flex-1 flex flex-col h-full overflow-hidden select-none">
        
        {/* Top Navbar */}
        <Navbar 
          showBack={inWizardFlow} 
          onBack={handleCancelWizard} 
        />
        
        {/* Scrollable Canvas Container */}
        <main className="flex-1 overflow-y-auto px-2 py-4 no-scrollbar">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab + (inWizardFlow ? '-wizard' : '')}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25 }}
              className="w-full max-w-6xl mx-auto"
            >
              {renderMainContent()}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
