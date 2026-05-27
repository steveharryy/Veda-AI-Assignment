export interface Assignment {
  id: string;
  title: string;
  assignedDate: string;
  dueDate: string;
}

export interface QuestionTypeRow {
  id: string;
  type: string;
  questionCount: number;
  marks: number;
}

export interface WizardForm {
  dueDate: string;
  questionTypes: QuestionTypeRow[];
  files: string[];
  instructions: string;
  totalQuestions: number;
  totalMarks: number;
}

export interface GeneratedQuestion {
  question: string;
  difficulty: 'Easy' | 'Moderate' | 'Hard' | 'Challenging';
  marks: number;
}

export interface GeneratedSection {
  title: string;
  instruction: string;
  questions: GeneratedQuestion[];
}

export interface GeneratedPaper {
  title: string;
  schoolName: string;
  subject: string;
  gradeClass: string;
  timeAllowed: string;
  maxMarks: string;
  sections: GeneratedSection[];
  answerKey: string[];
  generatedAt?: string;
}
