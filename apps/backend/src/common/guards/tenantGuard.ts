import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from './authGuard';

export const enforceTenantIsolation = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  next();
};
