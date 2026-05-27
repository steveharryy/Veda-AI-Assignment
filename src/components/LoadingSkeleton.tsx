import React from 'react';
import { Brain, CheckCircle2, Loader2, Server } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAssignmentStore } from '../store/useAssignmentStore';
import { useAssignmentSocket } from '../hooks/useAssignmentSocket';

export const CardGridSkeleton: React.FC = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full no-print">
      {Array.from({ length: 6 }).map((_, idx) => (
        <div
          key={idx}
          className="bg-white rounded-[24px] p-6 h-[160px] border border-neutral-100 shadow-sm flex flex-col justify-between animate-pulse"
        >
          <div className="flex justify-between items-start">
            <div className="h-6 bg-neutral-200 rounded-full w-2/3" />
            <div className="h-6 bg-neutral-200 rounded-full w-6" />
          </div>
          <div className="flex justify-between items-end mt-4">
            <div className="h-4 bg-neutral-100 rounded-full w-1/3" />
            <div className="h-4 bg-neutral-100 rounded-full w-1/3" />
          </div>
        </div>
      ))}
    </div>
  );
};

export const A4PaperSkeleton: React.FC = () => {
  return (
    <div className="bg-white rounded-[24px] p-12 max-w-4xl mx-auto shadow-sm min-h-[800px] flex flex-col gap-6 animate-pulse">
      <div className="flex flex-col items-center gap-3">
        <div className="h-8 bg-neutral-200 rounded-full w-1/2" />
        <div className="h-5 bg-neutral-200 rounded-full w-1/3" />
        <div className="h-5 bg-neutral-200 rounded-full w-1/4" />
      </div>
      
      <div className="flex justify-between mt-8">
        <div className="h-4 bg-neutral-100 rounded-full w-1/4" />
        <div className="h-4 bg-neutral-100 rounded-full w-1/4" />
      </div>

      <div className="h-[1px] bg-neutral-200 w-full my-4" />

      <div className="flex flex-col gap-3">
        <div className="h-4 bg-neutral-100 rounded-full w-1/3" />
        <div className="h-4 bg-neutral-100 rounded-full w-1/3" />
        <div className="h-4 bg-neutral-100 rounded-full w-1/3" />
      </div>

      <div className="flex flex-col gap-4 mt-8">
        <div className="h-6 bg-neutral-200 rounded-full w-1/6" />
        <div className="h-4 bg-neutral-100 rounded-full w-1/2" />
        
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="flex justify-between items-center gap-4 mt-2">
            <div className="h-5 bg-neutral-200 rounded-full w-5/6" />
            <div className="h-5 bg-neutral-200 rounded-full w-12" />
          </div>
        ))}
      </div>
    </div>
  );
};

interface AIWizardGeneratingSkeletonProps {
  assignmentId: string | null;
  onComplete: () => void;
}

export const AIWizardGeneratingSkeleton: React.FC<AIWizardGeneratingSkeletonProps> = ({ 
  assignmentId, 
  onComplete 
}) => {
  useAssignmentSocket(assignmentId);

  const { generationLogs, generationStatus } = useAssignmentStore();

  React.useEffect(() => {
    if (generationStatus === 'completed') {
      const timer = setTimeout(() => {
        onComplete();
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [generationStatus, onComplete]);

  const getProgressPercentage = () => {
    if (generationStatus === 'completed') return 100;
    if (generationStatus === 'failed') return 100;
    if (generationStatus === 'idle') return 15;
    
    const baseProgress = 25;
    const increment = 25;
    return Math.min(baseProgress + generationLogs.length * increment, 88);
  };

  const progress = getProgressPercentage();

  return (
    <div className="bg-white rounded-[24px] p-8 md:p-12 max-w-2xl mx-auto shadow-sm border border-neutral-100 flex flex-col items-center justify-center min-h-[480px] card-shadow no-print">
      <div className="relative w-20 h-20 mb-8 select-none">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 3, ease: 'linear' }}
          className="absolute inset-0 border-4 border-dashed border-orange-500 rounded-full opacity-60"
        />
        <motion.div
          animate={{ scale: [1, 1.08, 1] }}
          transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
          className="absolute inset-2 bg-black rounded-full flex items-center justify-center shadow-lg"
        >
          {generationStatus === 'completed' ? (
            <CheckCircle2 className="w-8 h-8 text-orange-400" />
          ) : (
            <Brain className="w-8 h-8 text-white animate-pulse" />
          )}
        </motion.div>
      </div>

      <h2 className="text-2xl font-bold mb-2 text-center tracking-tight text-neutral-800">
        {generationStatus === 'completed' 
          ? 'Exam Paper Synthesized!' 
          : generationStatus === 'failed' 
          ? 'Synthesis Failed' 
          : 'VedaAI is crafting your exam...'}
      </h2>
      
      <p className="text-neutral-500 text-sm text-center mb-8 max-w-sm">
        {generationStatus === 'completed'
          ? 'Redirecting to your formatted A4 examination paper...'
          : "Asynchronously distributing cognitive parameters using Bloom's blueprint blueprints."}
      </p>

      <div className="w-full bg-neutral-100 h-[6px] rounded-full overflow-hidden mb-8 relative">
        <motion.div
          className={`h-full rounded-full transition-all duration-300 ${
            generationStatus === 'failed' ? 'bg-red-500' : 'bg-black'
          }`}
          style={{ width: `${progress}%` }}
          layout
        />
      </div>

      <div className="w-full max-w-md bg-neutral-50 border border-neutral-100 rounded-2xl p-5 sm:p-6 shadow-inner min-h-[160px] flex flex-col justify-start">
        <div className="flex flex-col gap-4">
          <AnimatePresence>
            {generationLogs.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="flex items-center gap-3 text-neutral-500"
              >
                <Loader2 className="w-4 h-4 text-orange-500 animate-spin flex-shrink-0" />
                <span className="text-xs sm:text-sm font-medium">Connecting to secure synthesis queue...</span>
              </motion.div>
            ) : (
              generationLogs.map((logText, idx) => {
                const isLatest = idx === generationLogs.length - 1;
                const isFail = logText.startsWith('❌');
                const isSuccess = logText.startsWith('✓');
                
                return (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 10, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ duration: 0.3, ease: 'easeOut' }}
                    className={`flex items-start gap-3 transition-all ${
                      isLatest ? 'opacity-100 font-bold' : 'opacity-50 font-normal'
                    }`}
                  >
                    <div className="mt-0.5 flex-shrink-0">
                      {isSuccess ? (
                        <CheckCircle2 className="w-4.5 h-4.5 text-emerald-500" />
                      ) : isFail ? (
                        <CheckCircle2 className="w-4.5 h-4.5 text-red-500" />
                      ) : isLatest ? (
                        <Loader2 className="w-4 h-4 text-orange-500 animate-spin" />
                      ) : (
                        <Server className="w-4 h-4 text-neutral-400" />
                      )}
                    </div>
                    <span className={`text-xs sm:text-sm leading-relaxed ${
                      isFail ? 'text-red-500' : isSuccess ? 'text-emerald-700' : isLatest ? 'text-orange-600' : 'text-neutral-600'
                    }`}>
                      {logText}
                    </span>
                  </motion.div>
                );
              })
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};
