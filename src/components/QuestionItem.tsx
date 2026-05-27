import React from 'react';
import { GeneratedQuestion } from '../types';
import { DifficultyBadge } from './DifficultyBadge';

interface QuestionItemProps {
  question: GeneratedQuestion;
  index: number;
}

export const QuestionItem: React.FC<QuestionItemProps> = ({ question, index }) => {
  return (
    <div className="flex gap-4 items-start py-2.5 group">
      {/* Question Number */}
      <span className="text-[14px] font-extrabold text-neutral-800 w-5 mt-0.5 select-none">
        {index}.
      </span>
      
      {/* Content & Metadata */}
      <div className="flex-1 flex flex-col gap-1 min-w-0">
        {/* On-screen visual tags (hidden when printing) */}
        <div className="flex items-center gap-2 no-print select-none">
          <DifficultyBadge difficulty={question.difficulty} />
          <span className="text-[10px] font-extrabold bg-neutral-50 text-neutral-500 border border-neutral-200 px-2 py-0.5 rounded-full uppercase tracking-wider">
            {question.marks} {question.marks === 1 ? 'Mark' : 'Marks'}
          </span>
        </div>
        
        {/* Question Text */}
        <p className="text-[14px] text-neutral-800 leading-relaxed font-semibold mt-1 pr-4">
          {question.question}
        </p>
      </div>

      {/* Print Marks Display (right-aligned, optimized for physical exam sheets) */}
      <span className="text-[13px] font-extrabold text-neutral-800 whitespace-nowrap pt-1 font-mono select-none">
        [{question.marks} {question.marks === 1 ? 'Mark' : 'Marks'}]
      </span>
    </div>
  );
};
