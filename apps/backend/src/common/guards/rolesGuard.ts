import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from './authGuard';
import { AppError } from '../middleware/errorHandler';

export const authorizeRoles = (...allowedRoles: string[]) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(new AppError('Unauthorized access', 401, 'UNAUTHORIZED'));
    }

    if (!allowedRoles.includes(req.user.role)) {
      return next(new AppError(`Forbidden: Action requires one of roles: [${allowedRoles.join(', ')}]`, 403, 'FORBIDDEN'));
    }

    next();
  };
};
