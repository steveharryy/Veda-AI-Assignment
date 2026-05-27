import { Schema, model } from 'mongoose';
import { IGeneratedPaper } from '../types';

const GeneratedQuestionSchema = new Schema({
  question: { 
    type: String, 
    required: true 
  },
  difficulty: { 
    type: String, 
    required: true,
    enum: ['Easy', 'Moderate', 'Hard']
  },
  marks: { 
    type: Number, 
    required: true,
    min: 1
  }
}, { _id: false });

const GeneratedSectionSchema = new Schema({
  title: { 
    type: String, 
    required: true 
  },
  instruction: { 
    type: String, 
    default: '' 
  },
  questions: { 
    type: [GeneratedQuestionSchema], 
    required: true 
  }
}, { _id: false });

const GeneratedPaperSchema = new Schema<IGeneratedPaper>({
  assignmentId: { 
    type: Schema.Types.ObjectId, 
    ref: 'Assignment',
    required: true,
    unique: true // One generated paper per assignment
  },
  title: { 
    type: String, 
    required: true 
  },
  schoolName: { 
    type: String, 
    default: 'Delhi Public School' 
  },
  subject: { 
    type: String, 
    default: 'Science' 
  },
  gradeClass: { 
    type: String, 
    default: 'Class VIII' 
  },
  timeAllowed: { 
    type: String, 
    default: '3 Hours' 
  },
  maxMarks: { 
    type: String, 
    default: '60' 
  },
  sections: { 
    type: [GeneratedSectionSchema], 
    required: true 
  },
  answerKey: { 
    type: [String], 
    required: true 
  },
  generatedAt: { 
    type: Date, 
    default: Date.now 
  }
});

export const GeneratedPaper = model<IGeneratedPaper>('GeneratedPaper', GeneratedPaperSchema);
export default GeneratedPaper;
