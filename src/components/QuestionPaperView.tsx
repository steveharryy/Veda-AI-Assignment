'use client';

import React, { useState } from 'react';
import { Download, Sparkles, ArrowLeft, Printer, Eye, EyeOff } from 'lucide-react';
import { useAssignmentStore } from '../store/useAssignmentStore';
import { ExamSection } from './ExamSection';
import { motion, AnimatePresence } from 'framer-motion';

interface QuestionPaperViewProps {
  onBack: () => void;
}

export const QuestionPaperView: React.FC<QuestionPaperViewProps> = ({ onBack }) => {
  const { generatedPaper } = useAssignmentStore();
  const [showAnswerKey, setShowAnswerKey] = useState(true);

  const handleDownloadPDF = () => {
    // Triggers browser-native print layout. Hidden modules are stripped out by no-print classes
    window.print();
  };

  if (!generatedPaper) {
    return (
      <div className="flex flex-col items-center justify-center p-12 bg-white rounded-[24px] border border-neutral-100 shadow-sm">
        <p className="text-neutral-500">No generated question paper found.</p>
      </div>
    );
  }

  // Calculate total questions dynamically across all sections
  let globalQuestionIndex = 1;

  return (
    <div className="flex flex-col gap-6 w-full select-none pb-24">
      
      {/* Top AI Banner */}
      <div className="bg-neutral-900 rounded-[24px] p-6 text-white card-shadow flex flex-col md:flex-row justify-between items-start md:items-center gap-4 relative overflow-hidden no-print">
        {/* Decorative background glow */}
        <div className="absolute right-0 top-0 w-[240px] h-[240px] bg-gradient-to-bl from-orange-500/10 to-transparent rounded-full blur-2xl pointer-events-none -z-10" />

        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-orange-500 to-red-500 flex items-center justify-center text-white shadow-md flex-shrink-0 mt-1">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-white font-bold text-[16px] tracking-tight leading-snug">
              Custom AI Blueprint Ready!
            </h3>
            <p className="text-neutral-400 text-xs sm:text-[13px] leading-relaxed mt-1 max-w-xl">
              VedaAI has synthesized your curriculum into a standard printable A4 layout complete with sections and grading keys.
            </p>
          </div>
        </div>

        {/* Action button triggers */}
        <div className="flex flex-wrap gap-2.5 flex-shrink-0 self-stretch md:self-center justify-end">
          {/* Answer Key Toggle (extremely practical teacher tool) */}
          <button
            onClick={() => setShowAnswerKey(!showAnswerKey)}
            className="h-[40px] px-4 rounded-full border border-neutral-700 hover:border-neutral-500 text-neutral-300 hover:text-white font-bold text-xs flex items-center gap-1.5 transition-all"
            title="Toggle grading answer key before printing"
          >
            {showAnswerKey ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
            <span>{showAnswerKey ? 'Hide Answer Key' : 'Show Answer Key'}</span>
          </button>

          <button
            onClick={onBack}
            className="h-[40px] px-4 rounded-full border border-neutral-700 hover:border-neutral-500 text-neutral-300 hover:text-white font-bold text-xs flex items-center gap-1.5 transition-all"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Criteria Form</span>
          </button>
          
          <button
            onClick={handleDownloadPDF}
            className="h-[40px] px-5 bg-white hover:bg-neutral-100 text-black font-bold text-xs rounded-full shadow-md flex items-center gap-2 transition-all active:scale-95"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download as PDF</span>
          </button>
        </div>
      </div>

      {/* White A4 Centered Exam Paper Container */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="bg-white rounded-[24px] p-8 sm:p-12 max-w-[850px] mx-auto shadow-sm border border-neutral-100 w-full card-shadow flex flex-col gap-6 print-container"
      >
        {/* Centered Exam Header */}
        <div className="flex flex-col items-center text-center gap-1">
          <h2 className="text-xl sm:text-2xl font-black text-black tracking-tight uppercase">
            {generatedPaper.schoolName}
          </h2>
          <div className="flex flex-wrap items-center justify-center gap-4 text-xs sm:text-sm font-bold text-neutral-600 mt-1">
            <span>Subject: {generatedPaper.subject}</span>
            <span className="w-1.5 h-1.5 bg-neutral-300 rounded-full" />
            <span>{generatedPaper.gradeClass}</span>
          </div>
        </div>

        {/* Exam Metadata parameters */}
        <div className="flex justify-between items-center text-[13px] font-bold text-neutral-800 border-b border-neutral-100 pb-3 mt-4">
          <span>Time Allowed: {generatedPaper.timeAllowed}</span>
          <span>Maximum Marks: {generatedPaper.maxMarks}</span>
        </div>

        {/* Student lines block */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-[13px] font-semibold text-neutral-800 bg-white border border-neutral-100 p-4 rounded-xl shadow-inner mt-1 select-none">
          <div className="flex gap-2">
            <span>Name:</span>
            <span className="flex-1 border-b border-dashed border-neutral-300 mt-1 min-w-[100px]" />
          </div>
          <div className="flex gap-2">
            <span>Roll Number:</span>
            <span className="flex-1 border-b border-dashed border-neutral-300 mt-1 min-w-[80px]" />
          </div>
          <div className="flex gap-2">
            <span>Class & Section:</span>
            <span className="flex-1 border-b border-dashed border-neutral-300 mt-1 min-w-[100px]" />
          </div>
        </div>

        {/* Dynamically rendered Question Sections using modular ExamSection component */}
        <div className="flex flex-col gap-8 mt-2">
          {generatedPaper.sections.map((section, idx) => {
            const sectionStartIdx = globalQuestionIndex;
            globalQuestionIndex += section.questions.length;

            return (
              <ExamSection
                key={idx}
                section={section}
                startIndex={sectionStartIdx}
              />
            );
          })}
        </div>

        {/* Question sheet center footer */}
        <div className="flex items-center justify-center py-6 mt-4 select-none">
          <span className="text-xs font-bold tracking-widest text-neutral-400 uppercase">
            — End of Question Paper —
          </span>
        </div>

        {/* Answer Key (visible if showAnswerKey is true, and hides automatically during student print layouts if toggled off) */}
        <AnimatePresence>
          {showAnswerKey && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="flex flex-col gap-4 mt-8 pt-8 border-t-[2px] border-dashed border-neutral-200 overflow-hidden print-page-break"
            >
              <div className="flex items-center gap-2 select-none">
                <span className="w-2.5 h-2.5 bg-orange-500 rounded-full" />
                <h4 className="text-[15px] font-extrabold text-neutral-800 tracking-tight">Answer Key</h4>
                <span className="text-[10px] bg-orange-50 border border-orange-100 text-orange-600 px-2 py-0.5 rounded-full font-bold uppercase ml-1 no-print">
                  Teacher View Only
                </span>
              </div>
              
              <div className="flex flex-col gap-4 pl-4 border-l border-neutral-100 mt-2">
                {generatedPaper.answerKey.map((answer, i) => (
                  <div key={i} className="text-xs text-neutral-600 leading-relaxed flex gap-2.5">
                    <span className="font-bold text-neutral-800">{i + 1}.</span>
                    <p className="whitespace-pre-line font-medium leading-relaxed">{answer}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </motion.div>

      {/* Floating printing trigger for fast access */}
      <div className="fixed bottom-8 right-8 z-40 no-print">
        <button
          onClick={handleDownloadPDF}
          className="bg-black hover:bg-neutral-800 text-white w-12 h-12 rounded-full flex items-center justify-center shadow-2xl active:scale-95 transition-all"
          title="Print / Save PDF"
        >
          <Printer className="w-5 h-5 text-white" />
        </button>
      </div>

    </div>
  );
};
