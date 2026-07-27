import { Response, NextFunction } from 'express';
import { AiService } from './ai.service';
import { AuthenticatedRequest } from '../../common/guards/authGuard';

export class AiController {
  static async chat(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { prompt } = req.body;
      if (!req.user) {
        return res.status(401).json({ success: false, error: { code: 'UNAUTHORIZED', message: 'Not authenticated' } });
      }
      if (!prompt || typeof prompt !== 'string') {
        return res.status(400).json({ success: false, error: { code: 'INVALID_PROMPT', message: 'Prompt is required' } });
      }

      const result = await AiService.processUserPrompt(req.user.id, prompt);
      return res.json({
        success: true,
        data: result,
        meta: { timestamp: new Date().toISOString() },
      });
    } catch (err) {
      next(err);
    }
  }

  static async getRecommendations(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        return res.status(401).json({ success: false, error: { code: 'UNAUTHORIZED', message: 'Not authenticated' } });
      }
      const data = await AiService.getRecommendations(req.user.id);
      return res.json({
        success: true,
        data,
        meta: { timestamp: new Date().toISOString() },
      });
    } catch (err) {
      next(err);
    }
  }

  static async getDailyTip(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        return res.status(401).json({ success: false, error: { code: 'UNAUTHORIZED', message: 'Not authenticated' } });
      }
      const data = await AiService.getDailyEcoTip(req.user.id);
      return res.json({
        success: true,
        data,
        meta: { timestamp: new Date().toISOString() },
      });
    } catch (err) {
      next(err);
    }
  }

  static async getPerformanceAnalysis(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        return res.status(401).json({ success: false, error: { code: 'UNAUTHORIZED', message: 'Not authenticated' } });
      }
      const data = await AiService.getPerformanceAnalysis(req.user.id);
      return res.json({
        success: true,
        data,
        meta: { timestamp: new Date().toISOString() },
      });
    } catch (err) {
      next(err);
    }
  }
}
