import { query } from '../config/db.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../middleware/errorHandler.js';

export const listNotifications = asyncHandler(async (req, res) => {
  const result = await query(
    `SELECT * FROM notifications WHERE student_id = $1 ORDER BY created_at DESC`,
    [req.user.id]
  );
  res.json({ notifications: result.rows });
});

export const markAsRead = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const result = await query(
    `UPDATE notifications SET is_read = true WHERE id = $1 AND student_id = $2 RETURNING *`,
    [id, req.user.id]
  );
  if (result.rows.length === 0) throw new ApiError(404, 'Notification not found.');
  res.json({ notification: result.rows[0] });
});

export const markAllAsRead = asyncHandler(async (req, res) => {
  await query(`UPDATE notifications SET is_read = true WHERE student_id = $1 AND is_read = false`, [req.user.id]);
  res.json({ message: 'All notifications marked as read.' });
});
