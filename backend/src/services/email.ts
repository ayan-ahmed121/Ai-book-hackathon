import { Resend } from 'resend';

let resend: Resend | null = null;

function getResendClient(): Resend {
  if (!resend) {
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      throw new Error('RESEND_API_KEY environment variable is not set');
    }
    resend = new Resend(apiKey);
  }
  return resend;
}

export async function sendPasswordResetEmail({
  email,
  resetUrl,
}: {
  email: string;
  resetUrl: string;
}): Promise<void> {
  const client = getResendClient();

  // Fire and forget to avoid timing attacks
  client.emails
    .send({
      from: 'noreply@yourtextbook.com',
      to: email,
      subject: 'Reset Your Password - AI Textbook',
      html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>Reset Your Password</title>
        </head>
        <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #333;">Password Reset Request</h2>
          <p style="color: #666;">You requested to reset your password for your AI Textbook account.</p>
          <p style="color: #666;">Click the button below to set a new password:</p>
          <a href="${resetUrl}"
             style="display: inline-block; padding: 12px 24px; background: #2563eb; color: white; text-decoration: none; border-radius: 6px; margin: 16px 0;">
            Reset Password
          </a>
          <p style="color: #999; font-size: 12px;">This link expires in 1 hour.</p>
          <p style="color: #999; font-size: 12px;">If you didn't request this, you can safely ignore this email.</p>
        </body>
      </html>
    `,
    })
    .catch((error) => {
      console.error('Failed to send password reset email:', error);
    });
}

export async function sendWelcomeEmail({
  email,
  name,
}: {
  email: string;
  name: string;
}): Promise<void> {
  const client = getResendClient();

  client.emails
    .send({
      from: 'noreply@yourtextbook.com',
      to: email,
      subject: 'Welcome to AI-Native Textbook',
      html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>Welcome</title>
        </head>
        <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #333;">Welcome, ${name}!</h2>
          <p style="color: #666;">Thank you for joining the AI-Native Textbook for Physical AI & Humanoid Robotics.</p>
          <p style="color: #666;">Start learning at your own pace with our interactive chapters, AI-powered Q&A, and personalized content.</p>
          <p style="color: #666;">Happy learning!</p>
        </body>
      </html>
    `,
    })
    .catch((error) => {
      console.error('Failed to send welcome email:', error);
    });
}

// Health check
export async function checkEmailService(): Promise<boolean> {
  try {
    getResendClient();
    return true;
  } catch {
    return false;
  }
}
