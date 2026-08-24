import { Router } from 'express';
import { listCourses, getCourseDetails } from '../controllers/courses.controller.js';
import { setLessonProgress } from '../controllers/lessons.controller.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

router.use(requireAuth);
router.get('/', listCourses);
router.get('/:id', getCourseDetails);
router.put('/:courseId/lessons/:lessonId/progress', setLessonProgress);

export default router;
