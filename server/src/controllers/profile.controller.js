import { query } from '../config/db.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../middleware/errorHandler.js';

function toPublicUser(user) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    profileImage: user.profile_image,
    bio: user.bio,
    program: user.program,
    year: user.year,
    location: user.location,
    interests: user.interests || [],
    learningGoals: user.learning_goals,
  };
}

export const getProfile = asyncHandler(async (req, res) => {
  const result = await query(
    `SELECT u.*,
       COUNT(*) FILTER (WHERE e.status = 'completed') AS completed_courses
     FROM users u
     LEFT JOIN enrollments e ON e.student_id = u.id
     WHERE u.id = $1
     GROUP BY u.id`,
    [req.user.id]
  );
  const user = result.rows[0];
  if (!user) throw new ApiError(404, 'User not found.');

  res.json({
    profile: {
      ...toPublicUser(user),
      completedCourses: Number(user.completed_courses),
    },
  });
});

export const updateProfile = asyncHandler(async (req, res) => {
  const { name, bio, program, year, location, interests, learningGoals } = req.body;

  if (name !== undefined && !name.trim()) {
    throw new ApiError(400, 'Name cannot be empty.');
  }

  const result = await query(
    `UPDATE users SET
       name = COALESCE($1, name),
       bio = COALESCE($2, bio),
       program = COALESCE($3, program),
       year = COALESCE($4, year),
       location = COALESCE($5, location),
       interests = COALESCE($6, interests),
       learning_goals = COALESCE($7, learning_goals),
       updated_at = now()
     WHERE id = $8
     RETURNING *`,
    [
      name?.trim() ?? null,
      bio ?? null,
      program ?? null,
      year ?? null,
      location ?? null,
      Array.isArray(interests) ? interests : null,
      learningGoals ?? null,
      req.user.id,
    ]
  );

  res.json({ profile: toPublicUser(result.rows[0]) });
});
