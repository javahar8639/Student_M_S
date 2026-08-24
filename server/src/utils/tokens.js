import crypto from 'crypto';

// Generates a random reset token. The raw token is emailed to the user and
// never stored; only its SHA-256 hash is persisted so a leaked database
// cannot be used to forge password resets.
export function generateResetToken() {
  const rawToken = crypto.randomBytes(32).toString('hex');
  const tokenHash = hashToken(rawToken);
  return { rawToken, tokenHash };
}

export function hashToken(rawToken) {
  return crypto.createHash('sha256').update(rawToken).digest('hex');
}
