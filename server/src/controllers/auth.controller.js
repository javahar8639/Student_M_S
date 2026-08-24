import bcrypt from 'bcryptjs';
import { query } from '../config/db.js';
import { signToken } from '../utils/jwt.js';
import { generateResetToken, hashToken } from '../utils/tokens.js';
import { sendPasswordResetEmail } from '../utils/email.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../middleware/errorHandler.js';
import { isValidEmail, requireFields } from '../utils/validate.js';

const RESET_TOKEN_TTL_MINUTES = 30;

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

export const signup = asyncHandler(async (req, res) => {
  const { name, email, password, confirmPassword } = req.body;
  requireFields(req.body, ['name', 'email', 'password', 'confirmPassword']);

  if (!isValidEmail(email)) {
    throw new ApiError(400, 'Please enter a valid email address.');
  }
  if (password.length < 8) {
    throw new ApiError(400, 'Password must be at least 8 characters long.');
  }
  if (password !== confirmPassword) {
    throw new ApiError(400, 'Passwords do not match.');
  }

  const existing = await query('SELECT id FROM users WHERE email = $1', [email.toLowerCase()]);
  if (existing.rows.length > 0) {
    throw new ApiError(409, 'An account with this email already exists.');
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const result = await query(
    `INSERT INTO users (name, email, password_hash) VALUES ($1, $2, $3)
     RETURNING id, name, email, profile_image, bio, program, year, location, interests, learning_goals`,
    [name.trim(), email.toLowerCase(), passwordHash]
  );

  const user = result.rows[0];
  const token = signToken({ sub: user.id });
  res.status(201).json({ token, user: toPublicUser(user) });
});

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  requireFields(req.body, ['email', 'password']);

  const result = await query(
    `SELECT id, name, email, password_hash, profile_image, bio, program, year, location, interests, learning_goals
     FROM users WHERE email = $1`,
    [email.toLowerCase()]
  );

  const user = result.rows[0];
  if (!user) {
    throw new ApiError(401, 'Invalid email or password.');
  }

  const match = await bcrypt.compare(password, user.password_hash);
  if (!match) {
    throw new ApiError(401, 'Invalid email or password.');
  }

  const token = signToken({ sub: user.id });
  res.json({ token, user: toPublicUser(user) });
});

export const getCurrentUser = asyncHandler(async (req, res) => {
  const result = await query(
    `SELECT id, name, email, profile_image, bio, program, year, location, interests, learning_goals
     FROM users WHERE id = $1`,
    [req.user.id]
  );
  const user = result.rows[0];
  if (!user) {
    throw new ApiError(404, 'User not found.');
  }
  res.json({ user: toPublicUser(user) });
});

export const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;
  requireFields(req.body, ['email']);

  const genericResponse = {
    message: 'If an account with that email exists, a password reset link has been sent.',
  };

  if (!isValidEmail(email)) {
    return res.json(genericResponse);
  }

  const result = await query('SELECT id, name FROM users WHERE email = $1', [email.toLowerCase()]);
  const user = result.rows[0];

  if (user) {
    const { rawToken, tokenHash } = generateResetToken();
    const expiresAt = new Date(Date.now() + RESET_TOKEN_TTL_MINUTES * 60 * 1000);

    await query(
      `INSERT INTO password_reset_tokens (user_id, token_hash, expires_at) VALUES ($1, $2, $3)`,
      [user.id, tokenHash, expiresAt]
    );

    const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${rawToken}`;

    try {
      await sendPasswordResetEmail({ to: email, name: user.name, resetUrl });
    } catch (err) {
      console.error('Failed to send password reset email:', err);
    }
  }

  res.json(genericResponse);
});

export const resetPassword = asyncHandler(async (req, res) => {
  const { token, password, confirmPassword } = req.body;
  requireFields(req.body, ['token', 'password', 'confirmPassword']);

  if (password.length < 8) {
    throw new ApiError(400, 'Password must be at least 8 characters long.');
  }
  if (password !== confirmPassword) {
    throw new ApiError(400, 'Passwords do not match.');
  }

  const tokenHash = hashToken(token);
  const result = await query(
    `SELECT id, user_id, expires_at, used FROM password_reset_tokens WHERE token_hash = $1`,
    [tokenHash]
  );
  const resetRecord = result.rows[0];

  if (!resetRecord || resetRecord.used || new Date(resetRecord.expires_at) < new Date()) {
    throw new ApiError(400, 'This password reset link is invalid or has expired.');
  }

  const passwordHash = await bcrypt.hash(password, 10);

  await query('UPDATE users SET password_hash = $1, updated_at = now() WHERE id = $2', [
    passwordHash,
    resetRecord.user_id,
  ]);
  await query('UPDATE password_reset_tokens SET used = true WHERE id = $1', [resetRecord.id]);

  res.json({ message: 'Your password has been reset successfully.' });
});
