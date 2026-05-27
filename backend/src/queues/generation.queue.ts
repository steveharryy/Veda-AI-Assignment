import { Queue } from 'bullmq';
import { redisConnection } from '../config/redis';

// Configure generationQueue with shared Redis client
export const generationQueue = new Queue('generationQueue', {
  connection: redisConnection as any,
  defaultJobOptions: {
    attempts: 3, // Retry up to 3 times on unexpected worker crashes
    backoff: {
      type: 'exponential',
      delay: 5000 // Wait 5 seconds before retrying
    },
    removeOnComplete: true, // Auto clean Redis keys on completion to save RAM
    removeOnFail: false // Keep failed records for backend audit logs
  }
});

// Helper to push assignment generation jobs to the background queue
export const addGenerationJob = async (assignmentId: string): Promise<void> => {
  try {
    const job = await generationQueue.add('generateQuestionPaper', { assignmentId });
    console.log(`📡 [BullMQ] Job successfully dispatched. Job ID: ${job.id} for Assignment ID: ${assignmentId}`);
  } catch (error) {
    console.error(`💥 [BullMQ] Error adding job for Assignment ID: ${assignmentId}`, error);
    throw error;
  }
};

export default generationQueue;
