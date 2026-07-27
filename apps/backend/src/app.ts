import express from 'express';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import { config } from './config/env';
import { errorHandler } from './common/middleware/errorHandler';
import { securityHeaders } from './common/middleware/securityHeaders';
import { requestLogger } from './common/middleware/requestLogger';
import { openApiSpec } from './docs/swagger';
import { db } from './database/db';

import authRoutes from './modules/auth/auth.routes';
import usersRoutes from './modules/users/users.routes';
import classesRoutes from './modules/classes/classes.routes';
import modulesRoutes from './modules/modules/modules.routes';
import quizzesRoutes from './modules/quizzes/quizzes.routes';
import gamificationRoutes from './modules/gamification/gamification.routes';
import aiRoutes from './modules/ai/ai.routes';
import notificationsRoutes from './modules/notifications/notifications.routes';
import certificatesRoutes from './modules/certificates/certificates.routes';
import reportsRoutes from './modules/reports/reports.routes';

const app = express();

// Security & Logging Middleware
app.use(securityHeaders);
app.use(requestLogger);
app.use(cors({ origin: config.corsOrigin, credentials: true }));
app.use(express.json({ limit: '10mb' }));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 500,
  message: { success: false, error: { code: 'TOO_MANY_REQUESTS', message: 'Too many requests, please try again later.' } },
});
app.use(limiter);

// Enhanced Production Health Check
app.get('/api/v1/health', async (req, res) => {
  let dbStatus = 'healthy';
  try {
    await db.$queryRaw`SELECT 1`;
  } catch (e) {
    dbStatus = 'degraded';
  }

  res.json({
    success: true,
    data: {
      status: 'healthy',
      database: dbStatus,
      version: '1.0.0',
      environment: config.nodeEnv,
      uptimeSeconds: Math.floor(process.uptime()),
      memoryUsage: process.memoryUsage(),
    },
    meta: { timestamp: new Date().toISOString() },
  });
});

// OpenAPI Documentation JSON Endpoint
app.get('/api/v1/docs', (req, res) => {
  res.json(openApiSpec);
});

// API v1 Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/users', usersRoutes);
app.use('/api/v1/classes', classesRoutes);
app.use('/api/v1/modules', modulesRoutes);
app.use('/api/v1/quizzes', quizzesRoutes);
app.use('/api/v1/gamification', gamificationRoutes);
app.use('/api/v1/ai', aiRoutes);
app.use('/api/v1/notifications', notificationsRoutes);
app.use('/api/v1/certificates', certificatesRoutes);
app.use('/api/v1/reports', reportsRoutes);

// Central Error Handler
app.use(errorHandler);

export default app;
