import { query } from '../config/db.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { marksToLetter } from '../utils/grades.js';

export const getGrades = asyncHandler(async (req, res) => {
  const studentId = req.user.id;

  const gradedResult = await query(
    `SELECT s.id, s.marks, s.feedback, s.submitted_at, a.title AS assignment_title, a.max_marks,
       c.id AS course_id, c.title AS course_title
     FROM submissions s
     JOIN assignments a ON a.id = s.assignment_id
     JOIN courses c ON c.id = a.course_id
     WHERE s.student_id = $1 AND s.marks IS NOT NULL
     ORDER BY s.submitted_at DESC`,
    [studentId]
  );

  const graded = gradedResult.rows.map((row) => {
    const percentage = Math.round((row.marks / row.max_marks) * 100);
    return {
      submissionId: row.id,
      assignmentTitle: row.assignment_title,
      courseId: row.course_id,
      courseTitle: row.course_title,
      marks: row.marks,
      maxMarks: row.max_marks,
      percentage,
      letter: marksToLetter(percentage),
      feedback: row.feedback,
      submittedAt: row.submitted_at,
    };
  });

  const courseMap = new Map();
  for (const g of graded) {
    if (!courseMap.has(g.courseId)) {
      courseMap.set(g.courseId, { courseId: g.courseId, courseTitle: g.courseTitle, percentages: [] });
    }
    courseMap.get(g.courseId).percentages.push(g.percentage);
  }

  const courseGrades = Array.from(courseMap.values()).map((c) => {
    const average = Math.round(c.percentages.reduce((sum, p) => sum + p, 0) / c.percentages.length);
    return {
      courseId: c.courseId,
      courseTitle: c.courseTitle,
      percentage: average,
      letter: marksToLetter(average),
    };
  });

  const overallAverage = graded.length
    ? Math.round(graded.reduce((sum, g) => sum + g.percentage, 0) / graded.length)
    : 0;

  res.json({
    overallAverage,
    overallLetter: graded.length ? marksToLetter(overallAverage) : null,
    courseGrades,
    recentGrades: graded.slice(0, 6),
  });
});
