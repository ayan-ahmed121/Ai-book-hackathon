import { Router } from 'express';
import { checkDatabaseConnection } from '../db/client.js';
import { checkQdrantConnection } from '../services/qdrant.js';
import { checkEmailService } from '../services/email.js';

const router = Router();

interface HealthStatus {
  status: 'healthy' | 'degraded' | 'unhealthy';
  services: {
    database: 'up' | 'down';
    vectorDb: 'up' | 'down';
    email: 'up' | 'down';
  };
  timestamp: string;
}

router.get('/', async (_req, res) => {
  const [dbOk, qdrantOk, emailOk] = await Promise.all([
    checkDatabaseConnection(),
    checkQdrantConnection(),
    checkEmailService(),
  ]);

  const services = {
    database: dbOk ? 'up' : 'down',
    vectorDb: qdrantOk ? 'up' : 'down',
    email: emailOk ? 'up' : 'down',
  } as const;

  const allUp = dbOk && qdrantOk && emailOk;
  const allDown = !dbOk && !qdrantOk && !emailOk;

  const status: HealthStatus = {
    status: allUp ? 'healthy' : allDown ? 'unhealthy' : 'degraded',
    services,
    timestamp: new Date().toISOString(),
  };

  const httpStatus = status.status === 'healthy' ? 200 : status.status === 'degraded' ? 200 : 503;

  res.status(httpStatus).json(status);
});

export default router;
