import { Resend } from 'resend';

let resendClient = null;

function getClient() {
  if (!resendClient) {
    resendClient = new Resend(process.env.RESEND_API_KEY);
  }
  return resendClient;
}

export async function sendPasswordResetEmail({ to, name, resetUrl }) {
  const resend = getClient();
  const fromAddress = process.env.RESEND_FROM_EMAIL || 'StudentMS <onboarding@resend.dev>';

  const html = `
    <div style="font-family: Georgia, 'Times New Roman', serif; max-width: 480px; margin: 0 auto; color: #262421;">
      <h2 style="font-weight: 600; letter-spacing: -0.01em;">Reset your password</h2>
      <p style="line-height: 1.6;">Hi ${name},</p>
      <p style="line-height: 1.6;">
        We received a request to reset your password for your Student MS account.
        Reset your password using the button below.
      </p>
      <p style="margin: 32px 0;">
        <a href="${resetUrl}"
           style="background-color: #2f4538; color: #f6f3ee; padding: 12px 28px; border-radius: 6px; text-decoration: none; font-size: 15px; display: inline-block;">
          Reset Password
        </a>
      </p>
      <p style="line-height: 1.6; color: #6b675f; font-size: 14px;">
        This link will expire in 30 minutes. If you did not request this, you can safely ignore this email.
      </p>
    </div>
  `;

  await resend.emails.send({
    from: fromAddress,
    to,
    subject: 'Reset your password',
    html,
  });
}
