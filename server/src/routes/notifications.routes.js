import { Router } from 'express';
import { listNotifications, markAsRead, markAllAsRead } from '../controllers/notifications.controller.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

router.use(requireAuth);
router.get('/', listNotifications);
router.put('/read-all', markAllAsRead);
router.put('/:id/read', markAsRead);

export default router;
