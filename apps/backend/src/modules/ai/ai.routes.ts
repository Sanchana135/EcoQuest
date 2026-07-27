import { Router } from 'express';
import { AiController } from './ai.controller';
import { authenticateJwt } from '../../common/guards/authGuard';

const router = Router();

router.post('/chat', authenticateJwt, AiController.chat);
router.get('/recommendations', authenticateJwt, AiController.getRecommendations);
router.get('/daily-tip', authenticateJwt, AiController.getDailyTip);
router.get('/performance-analysis', authenticateJwt, AiController.getPerformanceAnalysis);

export default router;
