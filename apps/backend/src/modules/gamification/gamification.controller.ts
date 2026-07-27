import { Response, NextFunction } from 'express';
import { GamificationService } from './gamification.service';
import { AuthenticatedRequest } from '../../common/guards/authGuard';

export class GamificationController {
  static async getOverview(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        return res.status(401).json({ success: false, error: { code: 'UNAUTHORIZED', message: 'Not authenticated' } });
      }
      const data = await GamificationService.getStudentOverview(req.user.id);
      return res.json({
        success: true,
        data,
        meta: { timestamp: new Date().toISOString() },
      });
    } catch (err) {
      next(err);
    }
  }

  static async getLeaderboard(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { period } = req.query;
      const leaderboard = await GamificationService.getLeaderboard(period as 'all' | 'weekly');
      return res.json({
        success: true,
        data: leaderboard,
        meta: { total: leaderboard.length, timestamp: new Date().toISOString() },
      });
    } catch (err) {
      next(err);
    }
  }
}
