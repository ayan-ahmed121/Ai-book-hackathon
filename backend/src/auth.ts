import { betterAuth } from 'better-auth';
import { db } from './db/client.js';
import { sendPasswordResetEmail } from './services/email.js';

export const auth = betterAuth({
  database: {
    db,
    type: 'postgres',
  },
  emailAndPassword: {
    enabled: true,
    minPasswordLength: 8,
    maxPasswordLength: 128,
    autoSignIn: false,
    requireEmailVerification: false, // Disabled for MVP
    sendResetPassword: async ({ user, url }) => {
      await sendPasswordResetEmail({
        email: user.email,
        resetUrl: url,
      });
    },
    resetPasswordTokenExpiresIn: 3600, // 1 hour
  },
  session: {
    expiresIn: 7 * 24 * 60 * 60, // 7 days
    updateAge: 24 * 60 * 60, // Update session expiry daily
    cookieCache: {
      enabled: true,
      maxAge: 5 * 60, // 5 minutes cache
    },
  },
  trustedOrigins: [
    'http://localhost:3000',
    'http://localhost:3001',
    process.env.FRONTEND_URL || '',
  ].filter(Boolean),
});

// Export auth handler for Express
export const authHandler = auth.handler;

// Helper to get session from request
export async function getSession(req: Request) {
  return auth.api.getSession({
    headers: req.headers as unknown as Headers,
  });
}
