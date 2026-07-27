import { Router } from 'express';
import { CertificateController } from './certificates.controller';
import { authenticateJwt } from '../../common/guards/authGuard';
import { authorizeRoles } from '../../common/guards/rolesGuard';

const router = Router();

router.get('/my-certificates', authenticateJwt, CertificateController.getMyCertificates);
router.get('/all', authenticateJwt, authorizeRoles('ADMIN', 'TEACHER'), CertificateController.listAll);
router.get('/:id', authenticateJwt, CertificateController.getById);

export default router;
