import { Response, NextFunction } from 'express';
import { NotificationsService } from './notifications.service';
import { AuthenticatedRequest } from '../../common/guards/authGuard';

export class NotificationsController {
  static async list(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        return res.status(401).json({ success: false, error: { code: 'UNAUTHORIZED', message: 'Not authenticated' } });
      }
      const data = await NotificationsService.getUserNotifications(req.user.id);
      return res.json({
        success: true,
        data,
        meta: { timestamp: new Date().toISOString() },
      });
    } catch (err) {
      next(err);
    }
  }

  static async markRead(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      if (!req.user) {
        return res.status(401).json({ success: false, error: { code: 'UNAUTHORIZED', message: 'Not authenticated' } });
      }
      await NotificationsService.markAsRead(id, req.user.id);
      return res.json({
        success: true,
        data: { message: 'Notification marked as read' },
        meta: { timestamp: new Date().toISOString() },
      });
    } catch (err) {
      next(err);
    }
  }

  static async markAllRead(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        return res.status(401).json({ success: false, error: { code: 'UNAUTHORIZED', message: 'Not authenticated' } });
      }
      await NotificationsService.markAllAsRead(req.user.id);
      return res.json({
        success: true,
        data: { message: 'All notifications marked as read' },
        meta: { timestamp: new Date().toISOString() },
      });
    } catch (err) {
      next(err);
    }
  }
}
