import { Document, Types } from 'mongoose';

export interface QuestionTypeRow {
  type: string;
  questionCount: number;
  marks: number;
}

export type AssignmentStatus = 'pending' | 'processing' | 'completed' | 'failed';

export interface IAssignment extends Document {
  title: string;
  dueDate: Date;
  instructions: string;
  questionTypes: QuestionTypeRow[];
  status: AssignmentStatus;
  createdAt: Date;
  updatedAt: Date;
}

export interface IGeneratedQuestion {
  question: string;
  difficulty: 'Easy' | 'Moderate' | 'Hard';
  marks: number;
}

export interface IGeneratedSection {
  title: string;
  instruction: string;
  questions: IGeneratedQuestion[];
}

export interface IGeneratedPaper extends Document {
  assignmentId: Types.ObjectId | string;
  title: string;
  schoolName: string;
  subject: string;
  gradeClass: string;
  timeAllowed: string;
  maxMarks: string;
  sections: IGeneratedSection[];
  answerKey: string[];
  generatedAt: Date;
}

export interface CreateAssignmentInput {
  title: string;
  dueDate: string;
  instructions: string;
  questionTypes: QuestionTypeRow[];
}
