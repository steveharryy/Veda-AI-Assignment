import { Request, Response, NextFunction } from 'express';
import { isValidObjectId } from 'mongoose';
import { Assignment } from '../models/assignment.model';
import { GeneratedPaper } from '../models/generatedPaper.model';
import { addGenerationJob } from '../queues/generation.queue';

// POST /api/assignments - Validate and create new assignment
export const createAssignment = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { title, dueDate, instructions, questionTypes } = req.body;

    // 1. Strict Request Validation
    const validationErrors: string[] = [];

    if (!title || typeof title !== 'string' || title.trim() === '') {
      validationErrors.push('Title must be a non-empty string.');
    }

    if (!dueDate) {
      validationErrors.push('Due date is required.');
    } else {
      const parsedDate = new Date(dueDate);
      if (isNaN(parsedDate.getTime())) {
        validationErrors.push('Due date must be a valid ISO date.');
      }
    }

    if (!Array.isArray(questionTypes) || questionTypes.length === 0) {
      validationErrors.push('Question types blueprint must contain at least one row.');
    } else {
      // Validate each row in blueprint
      questionTypes.forEach((row: any, idx: number) => {
        const allowedTypes = ['Multiple Choice Questions', 'Short Questions', 'Long Questions', 'Diagram/Graph-Based Questions', 'Numerical Problems'];
        
        if (!row.type || !allowedTypes.includes(row.type)) {
          validationErrors.push(`Row ${idx + 1}: Invalid question type "${row.type || 'blank'}".`);
        }
        
        if (typeof row.questionCount !== 'number' || row.questionCount < 1) {
          validationErrors.push(`Row ${idx + 1}: Question count must be a positive integer (min 1, no negative values).`);
        }
        
        if (typeof row.marks !== 'number' || row.marks < 1) {
          validationErrors.push(`Row ${idx + 1}: Marks must be a positive integer (min 1, no negative values).`);
        }
      });
    }

    if (validationErrors.length > 0) {
      res.status(400).json({
        success: false,
        message: 'Request payload validation failed.',
        errors: validationErrors
      });
      return;
    }

    // 2. Persist Initial Assignment in Database (default status: 'pending')
    const assignment = new Assignment({
      title: title.trim(),
      dueDate: new Date(dueDate),
      instructions: instructions || '',
      questionTypes,
      status: 'pending'
    });

    await assignment.save();

    // 3. Dispatch Background Job to BullMQ Generation Queue
    await addGenerationJob(assignment.id);

    // 4. Return Assignment ID immediately
    res.status(201).json({
      success: true,
      assignmentId: assignment.id,
      status: assignment.status,
      message: 'Assignment successfully created. Question paper generation dispatched to background queue.'
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/assignments/:id - Retrieve assignment and generated paper
export const getAssignmentPaper = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;

    // 1. Validate Mongoose ObjectId format
    if (!isValidObjectId(id)) {
      res.status(400).json({
        success: false,
        message: 'Invalid assignment ID format.'
      });
      return;
    }

    // 2. Query Assignment metadata
    const assignment = await Assignment.findById(id);
    if (!assignment) {
      res.status(404).json({
        success: false,
        message: 'Assignment not found.'
      });
      return;
    }

    // 3. Query Generated Paper depending on status
    if (assignment.status === 'completed') {
      const paper = await GeneratedPaper.findOne({ assignmentId: id });
      if (!paper) {
        res.status(500).json({
          success: false,
          message: 'Assignment status marked completed, but question paper document was not found.'
        });
        return;
      }

      res.status(200).json({
        success: true,
        status: assignment.status,
        assignment,
        paper
      });
      return;
    }

    // Handle intermediate states (pending, processing, failed)
    let statusMessage = 'Question paper generation is currently queued and pending.';
    if (assignment.status === 'processing') {
      statusMessage = 'VedaAI is active and currently synthesizing the question paper layout.';
    } else if (assignment.status === 'failed') {
      statusMessage = 'Question paper generation encountered a background synthesis failure.';
    }

    res.status(200).json({
      success: true,
      status: assignment.status,
      assignment,
      message: statusMessage
    });
  } catch (error) {
    next(error);
  }
};
