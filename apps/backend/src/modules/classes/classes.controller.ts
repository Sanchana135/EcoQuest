import { Response, NextFunction } from 'express';
import { ClassesService } from './classes.service';
import { AuthenticatedRequest } from '../../common/guards/authGuard';

export class ClassesController {
  static async list(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const classes = await ClassesService.listForTenant();
      return res.json({
        success: true,
        data: classes,
        meta: { total: classes.length, timestamp: new Date().toISOString() },
      });
    } catch (err) {
      next(err);
    }
  }
}
