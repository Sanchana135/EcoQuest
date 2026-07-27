import { Response, NextFunction } from 'express';
import { CertificateService } from './certificates.service';
import { AuthenticatedRequest } from '../../common/guards/authGuard';

export class CertificateController {
  static async getMyCertificates(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        return res.status(401).json({ success: false, error: { code: 'UNAUTHORIZED', message: 'Not authenticated' } });
      }
      const certs = await CertificateService.getUserCertificates(req.user.id);
      return res.json({
        success: true,
        data: certs,
        meta: { total: certs.length, timestamp: new Date().toISOString() },
      });
    } catch (err) {
      next(err);
    }
  }

  static async getById(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const cert = await CertificateService.getCertificateById(id);
      if (!cert) {
        return res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Certificate not found' } });
      }
      return res.json({
        success: true,
        data: cert,
        meta: { timestamp: new Date().toISOString() },
      });
    } catch (err) {
      next(err);
    }
  }

  static async listAll(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const certs = await CertificateService.getAllCertificates();
      return res.json({
        success: true,
        data: certs,
        meta: { total: certs.length, timestamp: new Date().toISOString() },
      });
    } catch (err) {
      next(err);
    }
  }
}
