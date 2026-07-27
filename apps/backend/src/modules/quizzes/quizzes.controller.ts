import { Response, NextFunction } from 'express';
import { QuizzesService } from './quizzes.service';
import { AuthenticatedRequest } from '../../common/guards/authGuard';

export class QuizzesController {
  static async list(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const quizzes = await QuizzesService.listAll();
      return res.json({
        success: true,
        data: quizzes,
        meta: { total: quizzes.length, timestamp: new Date().toISOString() },
      });
    } catch (err) {
      next(err);
    }
  }

  static async getById(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const quiz = await QuizzesService.getById(id);
      return res.json({
        success: true,
        data: quiz,
        meta: { timestamp: new Date().toISOString() },
      });
    } catch (err) {
      next(err);
    }
  }

  static async submit(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const { answers } = req.body;
      if (!req.user) {
        return res.status(401).json({ success: false, error: { code: 'UNAUTHORIZED', message: 'Not authenticated' } });
      }
      if (!answers || !Array.isArray(answers)) {
        return res.status(400).json({ success: false, error: { code: 'INVALID_SUBMISSION', message: 'Answers must be an array' } });
      }

      const result = await QuizzesService.submitAttempt(req.user.id, id, answers);
      return res.json({
        success: true,
        data: result,
        meta: { timestamp: new Date().toISOString() },
      });
    } catch (err) {
      next(err);
    }
  }

  static async myAttempts(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        return res.status(401).json({ success: false, error: { code: 'UNAUTHORIZED', message: 'Not authenticated' } });
      }
      const attempts = await QuizzesService.getStudentAttempts(req.user.id);
      return res.json({
        success: true,
        data: attempts,
        meta: { total: attempts.length, timestamp: new Date().toISOString() },
      });
    } catch (err) {
      next(err);
    }
  }
}
