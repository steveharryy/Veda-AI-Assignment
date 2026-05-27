import { Router } from 'express';
import * as assignmentController from '../controllers/assignment.controller';

const router = Router();

// POST /api/assignments - Validate and create new assignment
router.post('/', assignmentController.createAssignment);

// GET /api/assignments/:id - Retrieve assignment and generated paper
router.get('/:id', assignmentController.getAssignmentPaper);

export default router;
