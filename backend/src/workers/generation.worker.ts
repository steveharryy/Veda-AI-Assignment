import { Worker, Job } from 'bullmq';
import mongoose from 'mongoose';
import { redisConnection } from '../config/redis';
import { Assignment } from '../models/assignment.model';
import { GeneratedPaper } from '../models/generatedPaper.model';
import { generateAIPaper } from '../utils/aiService';
import { 
  emitAssignmentProcessing, 
  emitAssignmentCompleted, 
  emitAssignmentFailed 
} from '../sockets/socket.handler';

const processGenerationJob = async (job: Job): Promise<void> => {
  const { assignmentId } = job.data;

  try {
    const assignment = await Assignment.findById(assignmentId);
    if (!assignment) {
      throw new Error(`Assignment not found with ID: ${assignmentId}`);
    }

    assignment.status = 'processing';
    await assignment.save();

    emitAssignmentProcessing(assignmentId, '🔍 Analyzing uploaded blueprint criteria & course parameters...');
    await new Promise((resolve) => setTimeout(resolve, 1500));

    emitAssignmentProcessing(assignmentId, "🧠 Distributing cognitive weights & generating Section questions...");
    await new Promise((resolve) => setTimeout(resolve, 1500));

    emitAssignmentProcessing(assignmentId, '✨ Formulating step-by-step grading solutions & Answer Key blueprints...');
    await new Promise((resolve) => setTimeout(resolve, 1500));

    const paperData = await generateAIPaper(assignment);

    const paper = new GeneratedPaper({
      assignmentId: new mongoose.Types.ObjectId(assignmentId),
      title: paperData.title,
      schoolName: paperData.schoolName,
      subject: paperData.subject,
      gradeClass: paperData.gradeClass,
      timeAllowed: paperData.timeAllowed,
      maxMarks: paperData.maxMarks,
      sections: paperData.sections,
      answerKey: paperData.answerKey
    });

    await paper.save();

    assignment.status = 'completed';
    await assignment.save();

    emitAssignmentCompleted(assignmentId, paper);
  } catch (error: any) {
    try {
      await Assignment.findByIdAndUpdate(assignmentId, { status: 'failed' });
      emitAssignmentFailed(assignmentId, error.message || 'AI synthesis encountered an internal queue error.');
    } catch (dbErr: any) {
      console.error(dbErr);
    }
    throw error;
  }
};

export const startGenerationWorker = (): Worker => {
  const worker = new Worker('generationQueue', processGenerationJob, {
    connection: redisConnection as any,
    concurrency: 2
  });

  return worker;
};

export default startGenerationWorker;
