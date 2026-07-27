import { Response, NextFunction } from 'express';
import { UsersService } from './users.service';
import { AuthenticatedRequest } from '../../common/guards/authGuard';

export class UsersController {
  static async list(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const users = await UsersService.listUsers();
      return res.json({
        success: true,
        data: users,
        meta: { total: users.length, timestamp: new Date().toISOString() },
      });
    } catch (err) {
      next(err);
    }
  }
}
