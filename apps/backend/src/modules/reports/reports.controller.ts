import { Response, NextFunction } from 'express';
import { ReportsService } from './reports.service';
import { AuthenticatedRequest } from '../../common/guards/authGuard';

export class ReportsController {
  static async getStudentReport(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        return res.status(401).json({ success: false, error: { code: 'UNAUTHORIZED', message: 'Not authenticated' } });
      }
      const data = await ReportsService.getStudentReport(req.user.id);
      return res.json({
        success: true,
        data,
        meta: { timestamp: new Date().toISOString() },
      });
    } catch (err) {
      next(err);
    }
  }

  static async getTeacherReport(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        return res.status(401).json({ success: false, error: { code: 'UNAUTHORIZED', message: 'Not authenticated' } });
      }
      const data = await ReportsService.getTeacherReport(req.user.id);
      return res.json({
        success: true,
        data,
        meta: { timestamp: new Date().toISOString() },
      });
    } catch (err) {
      next(err);
    }
  }

  static async getParentReport(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const studentId = req.query.studentId as string;
      const data = await ReportsService.getParentReport(studentId);
      return res.json({
        success: true,
        data,
        meta: { timestamp: new Date().toISOString() },
      });
    } catch (err) {
      next(err);
    }
  }

  static async getAdminAnalytics(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const data = await ReportsService.getAdminAnalytics();
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
