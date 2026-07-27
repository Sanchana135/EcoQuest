import { Request, Response, NextFunction } from 'express';
import { AuthService } from './auth.service';
import { AuthenticatedRequest } from '../../common/guards/authGuard';

export class AuthController {
  static async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        return res.status(400).json({ success: false, error: { code: 'MISSING_FIELDS', message: 'Email and password are required' } });
      }

      const result = await AuthService.login(email, password);
      return res.json({
        success: true,
        data: result,
        meta: { timestamp: new Date().toISOString() },
      });
    } catch (err) {
      next(err);
    }
  }

  static async register(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password, firstName, lastName, role } = req.body;
      if (!email || !password || !firstName || !lastName) {
        return res.status(400).json({ success: false, error: { code: 'MISSING_FIELDS', message: 'All required registration fields must be provided' } });
      }

      const result = await AuthService.register({ email, password, firstName, lastName, role });
      return res.status(201).json({
        success: true,
        data: result,
        meta: { timestamp: new Date().toISOString() },
      });
    } catch (err) {
      next(err);
    }
  }

  static async me(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        return res.status(401).json({ success: false, error: { code: 'UNAUTHORIZED', message: 'Not authenticated' } });
      }
      const profile = await AuthService.getUserProfile(req.user.id);
      return res.json({
        success: true,
        data: profile,
        meta: { timestamp: new Date().toISOString() },
      });
    } catch (err) {
      next(err);
    }
  }
}
