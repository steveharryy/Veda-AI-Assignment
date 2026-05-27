import React from 'react';
import { GeneratedSection } from '../types';
import { QuestionItem } from './QuestionItem';

interface ExamSectionProps {
  section: GeneratedSection;
  startIndex: number;
}

export const ExamSection: React.FC<ExamSectionProps> = ({ section, startIndex }) => {
  return (
    <div className="flex flex-col gap-5 mt-6 print-page-break">
      {/* Section Header */}
      <div className="flex flex-col gap-1 border-b border-neutral-200 pb-2 select-none">
        <h3 className="text-[16px] sm:text-[17px] font-black text-black tracking-tight uppercase">
          {section.title}
        </h3>
        {section.instruction && (
          <p className="text-neutral-500 text-[12px] whitespace-pre-line leading-relaxed italic mt-0.5">
            {section.instruction}
          </p>
        )}
      </div>

      {/* Questions list */}
      <div className="flex flex-col gap-1">
        {section.questions.map((q, idx) => (
          <QuestionItem 
            key={idx} 
            question={q} 
            index={startIndex + idx} 
          />
        ))}
      </div>
    </div>
  );
};
