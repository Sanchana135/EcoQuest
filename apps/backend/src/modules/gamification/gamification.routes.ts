import { Router } from 'express';
import { GamificationController } from './gamification.controller';
import { authenticateJwt } from '../../common/guards/authGuard';

const router = Router();

router.get('/overview', authenticateJwt, GamificationController.getOverview);
router.get('/leaderboard', authenticateJwt, GamificationController.getLeaderboard);

export default router;
