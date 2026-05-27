import React from 'react';
import { Plus, Eye } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAssignmentStore } from '../store/useAssignmentStore';

interface EmptyStateProps {
  onStartWizard: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ onStartWizard }) => {
  const { resetAssignments } = useAssignmentStore();

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-140px)] w-full text-center px-4">
      {/* Premium SVG Illustration Area */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="relative w-[340px] h-[240px] mb-8"
      >
        <svg viewBox="0 0 340 240" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
          {/* Background circles / decorative elements */}
          <circle cx="170" cy="120" r="80" fill="#EAEAEA" fillOpacity="0.5" />
          <path d="M70 120C70 80 110 50 170 50" stroke="#CBD5E1" strokeWidth="2" strokeLinecap="round" strokeDasharray="4 6" />
          
          {/* Sparkles */}
          <path d="M260 90L264 94L268 90L264 86L260 90Z" fill="#F97316" />
          <path d="M100 170L103 173L106 170L103 167L100 170Z" fill="#0EA5E9" />
          
          {/* Document Sheet */}
          <rect x="135" y="60" width="70" height="90" rx="8" fill="#FFFFFF" stroke="#D4D4D4" strokeWidth="2.5" />
          
          {/* Lines on document */}
          <line x1="148" y1="78" x2="192" y2="78" stroke="#D4D4D4" strokeWidth="3" strokeLinecap="round" />
          <line x1="148" y1="92" x2="192" y2="92" stroke="#E5E5E5" strokeWidth="3" strokeLinecap="round" />
          <line x1="148" y1="106" x2="180" y2="106" stroke="#E5E5E5" strokeWidth="3" strokeLinecap="round" />
          <line x1="148" y1="120" x2="170" y2="120" stroke="#F5F5F5" strokeWidth="3" strokeLinecap="round" />

          {/* Curly loop decoration on left */}
          <path d="M125 75C100 70 85 90 95 105C105 120 120 115 110 135" stroke="#475569" strokeWidth="2" strokeLinecap="round" />

          {/* Small floating card shape on right */}
          <rect x="215" y="85" width="28" height="18" rx="4" fill="#E5E5E5" />
          <circle cx="223" cy="94" r="2.5" fill="#A3A3A3" />
          <line x1="229" y1="94" x2="237" y2="94" stroke="#A3A3A3" strokeWidth="2" strokeLinecap="round" />

          {/* Magnifying Glass focusing on document */}
          <g filter="url(#drop-shadow)">
            {/* Glass body */}
            <circle cx="195" cy="135" r="32" fill="#FFFFFF" fillOpacity="0.4" stroke="#E5E5E5" strokeWidth="4" />
            <circle cx="195" cy="135" r="32" stroke="#A3A3A3" strokeWidth="2" />
            {/* Handle */}
            <path d="M217.5 157.5L245 185" stroke="#A3A3A3" strokeWidth="8" strokeLinecap="round" />
            <path d="M217.5 157.5L245 185" stroke="#D4D4D4" strokeWidth="4" strokeLinecap="round" />
          </g>

          {/* Bold Red Close / Cross Icon inside Magnifier */}
          <path d="M185 125L205 145" stroke="#EF4444" strokeWidth="6.5" strokeLinecap="round" />
          <path d="M205 125L185 145" stroke="#EF4444" strokeWidth="6.5" strokeLinecap="round" />

          <defs>
            <filter id="drop-shadow" x="150" y="95" width="115" height="115" filterUnits="userSpaceOnUse">
              <feDropShadow dx="2" dy="6" stdDeviation="6" floodOpacity="0.08" />
            </filter>
          </defs>
        </svg>
      </motion.div>

      {/* Main Text Content */}
      <h2 className="text-[22px] font-bold text-neutral-900 tracking-tight mb-2.5">
        No assignments yet
      </h2>
      <p className="text-neutral-500 text-[14px] leading-relaxed max-w-[440px] mb-8">
        Create your first assignment to start collecting and grading student submissions. 
        You can set up rubrics, define marking criteria, and let AI assist with grading.
      </p>

      {/* CTA Buttons */}
      <div className="flex flex-col sm:flex-row gap-3">
        <button
          onClick={onStartWizard}
          className="bg-black hover:bg-neutral-800 text-white font-medium text-[15px] px-8 h-[48px] rounded-full flex items-center justify-center gap-2 shadow-md active:scale-95 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Create Your First Assignment</span>
        </button>

        <button
          onClick={resetAssignments}
          className="bg-white border border-neutral-200 text-neutral-600 hover:text-black hover:border-neutral-400 font-medium text-[15px] px-6 h-[48px] rounded-full flex items-center justify-center gap-2 transition-all active:scale-95 shadow-sm"
        >
          <Eye className="w-4 h-4" />
          <span>View Mock Assignments List</span>
        </button>
      </div>
    </div>
  );
};
