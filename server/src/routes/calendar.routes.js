import { Router } from 'express';
import { getCalendarEvents } from '../controllers/calendar.controller.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

router.get('/', requireAuth, getCalendarEvents);

export default router;
