import { Router } from 'express';
import { getGrades } from '../controllers/grades.controller.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

router.use(requireAuth);
router.get('/', getGrades);

export default router;
