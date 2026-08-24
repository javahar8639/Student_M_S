import { query } from '../config/db.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { marksToLetter } from '../utils/grades.js';

export const getDashboard = asyncHandler(async (req, res) => {
  const studentId = req.user.id;

  const [summaryResult, continueLearningResult, tasksResult, activityResult, gradesResult] = await Promise.all([
    query(
      `SELECT
         COUNT(*) FILTER (WHERE status = 'in_progress') AS in_progress_courses,
         COUNT(*) FILTER (WHERE status = 'completed') AS completed_courses,
         COALESCE(ROUND(AVG(progress)), 0) AS overall_progress
       FROM enrollments WHERE student_id = $1`,
      [studentId]
    ),
    query(
      `SELECT c.id, c.title, c.instructor, c.thumbnail, e.progress,
         (SELECT l.title FROM lessons l
            LEFT JOIN lesson_progress lp ON lp.lesson_id = l.id AND lp.student_id = $1
            WHERE l.course_id = c.id AND COALESCE(lp.completed, false) = false
            ORDER BY l.order_number ASC LIMIT 1) AS next_lesson
       FROM enrollments e
       JOIN courses c ON c.id = e.course_id
       WHERE e.student_id = $1 AND e.status = 'in_progress'
       ORDER BY e.progress DESC`,
      [studentId]
    ),
    query(
      `SELECT a.id, a.title, a.due_date, c.title AS course_title,
         s.id AS submission_id, s.status AS submission_status, s.marks
       FROM assignments a
       JOIN courses c ON c.id = a.course_id
       LEFT JOIN submissions s ON s.assignment_id = a.id AND s.student_id = $1
       WHERE s.id IS NULL
       ORDER BY a.due_date ASC
       LIMIT 6`,
      [studentId]
    ),
    query(
      `(SELECT 'lesson_completed' AS kind, l.title AS label, c.title AS course_title, lp.completed_at AS occurred_at
          FROM lesson_progress lp
          JOIN lessons l ON l.id = lp.lesson_id
          JOIN courses c ON c.id = l.course_id
          WHERE lp.student_id = $1 AND lp.completed = true)
       UNION ALL
       (SELECT 'assignment_submitted' AS kind, a.title AS label, c.title AS course_title, s.submitted_at AS occurred_at
          FROM submissions s
          JOIN assignments a ON a.id = s.assignment_id
          JOIN courses c ON c.id = a.course_id
          WHERE s.student_id = $1 AND s.submitted_at IS NOT NULL)
       UNION ALL
       (SELECT 'course_completed' AS kind, c.title AS label, c.title AS course_title, e.completed_at AS occurred_at
          FROM enrollments e
          JOIN courses c ON c.id = e.course_id
          WHERE e.student_id = $1 AND e.completed_at IS NOT NULL)
       ORDER BY occurred_at DESC
       LIMIT 6`,
      [studentId]
    ),
    query(
      `SELECT s.marks, a.max_marks, a.title AS assignment_title, c.title AS course_title, s.submitted_at
       FROM submissions s
       JOIN assignments a ON a.id = s.assignment_id
       JOIN courses c ON c.id = a.course_id
       WHERE s.student_id = $1 AND s.marks IS NOT NULL
       ORDER BY s.submitted_at DESC
       LIMIT 4`,
      [studentId]
    ),
  ]);

  const summary = summaryResult.rows[0];
  const now = new Date();

  const upcomingTasks = tasksResult.rows.map((row) => {
    const dueDate = new Date(row.due_date);
    const daysUntilDue = Math.ceil((dueDate - now) / (1000 * 60 * 60 * 24));
    let urgency = 'upcoming';
    if (daysUntilDue < 0) urgency = 'overdue';
    else if (daysUntilDue <= 3) urgency = 'due_soon';

    return {
      id: row.id,
      title: row.title,
      courseTitle: row.course_title,
      dueDate: row.due_date,
      urgency,
    };
  });

  res.json({
    summary: {
      coursesInProgress: Number(summary.in_progress_courses),
      completedCourses: Number(summary.completed_courses),
      overallProgress: Number(summary.overall_progress),
      pendingAssignments: upcomingTasks.length,
    },
    continueLearning: continueLearningResult.rows.map((row) => ({
      id: row.id,
      title: row.title,
      instructor: row.instructor,
      thumbnail: row.thumbnail,
      progress: row.progress,
      nextLesson: row.next_lesson,
    })),
    upcomingTasks,
    recentActivity: activityResult.rows.map((row) => ({
      kind: row.kind,
      label: row.label,
      courseTitle: row.course_title,
      occurredAt: row.occurred_at,
    })),
    recentGrades: gradesResult.rows.map((row) => {
      const percentage = Math.round((row.marks / row.max_marks) * 100);
      return {
        assignmentTitle: row.assignment_title,
        courseTitle: row.course_title,
        percentage,
        letter: marksToLetter(percentage),
        submittedAt: row.submitted_at,
      };
    }),
  });
});
