import { Schema, model } from 'mongoose';
import { IAssignment } from '../types';

const QuestionTypeSchema = new Schema({
  type: { 
    type: String, 
    required: true,
    enum: ['Multiple Choice Questions', 'Short Questions', 'Long Questions', 'Diagram/Graph-Based Questions', 'Numerical Problems']
  },
  questionCount: { 
    type: Number, 
    required: true,
    min: 1
  },
  marks: { 
    type: Number, 
    required: true,
    min: 1
  }
}, { _id: false });

const AssignmentSchema = new Schema<IAssignment>({
  title: { 
    type: String, 
    required: true,
    trim: true 
  },
  dueDate: { 
    type: Date, 
    required: true 
  },
  instructions: { 
    type: String, 
    default: '' 
  },
  questionTypes: { 
    type: [QuestionTypeSchema], 
    required: true,
    validate: {
      validator: (arr: any) => Array.isArray(arr) && arr.length > 0,
      message: 'At least one question type parameter must be specified.'
    }
  },
  status: { 
    type: String, 
    required: true,
    enum: ['pending', 'processing', 'completed', 'failed'],
    default: 'pending'
  }
}, { 
  timestamps: true 
});

export const Assignment = model<IAssignment>('Assignment', AssignmentSchema);
export default Assignment;
