import { Response, NextFunction } from 'express';
import { InstitutionsService } from './institutions.service';
import { AuthenticatedRequest } from '../../common/guards/authGuard';

export class InstitutionsController {
  static async list(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const institutions = await InstitutionsService.listAll();
      return res.json({
        success: true,
        data: institutions,
        meta: { total: institutions.length, timestamp: new Date().toISOString() },
      });
    } catch (err) {
      next(err);
    }
  }
}
