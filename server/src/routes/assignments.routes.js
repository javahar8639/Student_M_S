import { Router } from 'express';
import { listAssignments, getAssignmentDetails } from '../controllers/assignments.controller.js';
import { submitAssignment } from '../controllers/submissions.controller.js';
import { requireAuth } from '../middleware/auth.js';
import { uploadAttachment } from '../middleware/upload.js';

const router = Router();

router.use(requireAuth);
router.get('/', listAssignments);
router.get('/:id', getAssignmentDetails);
router.post('/:id/submissions', uploadAttachment, submitAssignment);

export default router;
