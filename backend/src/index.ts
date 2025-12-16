import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { authHandler } from './auth.js';
import healthRouter from './api/health.js';

const app = express();
const PORT = process.env.PORT || 3001;

// CORS configuration
app.use(
  cors({
    origin: [
      'http://localhost:3000',
      'http://localhost:3001',
      process.env.FRONTEND_URL || '',
    ].filter(Boolean),
    credentials: true,
  })
);

// Body parsing
app.use(express.json({ limit: '10kb' }));

// Request logging
app.use((req, _res, next) => {
  console.log(`${new Date().toISOString()} ${req.method} ${req.path}`);
  next();
});

// Health check endpoint
app.use('/api/health', healthRouter);

// Better-Auth routes
app.all('/api/auth/*', (req, res) => {
  return authHandler(req, res);
});

// API routes (to be added)
// app.use('/api/chat', chatRouter);
// app.use('/api/user', userRouter);
// app.use('/api/quiz', quizRouter);

// 404 handler
app.use((_req, res) => {
  res.status(404).json({ error: 'Not Found', message: 'The requested resource does not exist' });
});

// Error handler
app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error('Unhandled error:', err);
  res.status(500).json({
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'An unexpected error occurred',
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/api/health`);
});

export default app;
