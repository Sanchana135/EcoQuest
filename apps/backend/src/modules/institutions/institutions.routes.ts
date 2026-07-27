import { Router } from 'express';
import { InstitutionsController } from './institutions.controller';
import { authenticateJwt } from '../../common/guards/authGuard';
import { authorizeRoles } from '../../common/guards/rolesGuard';

const router = Router();

router.get('/', authenticateJwt, authorizeRoles('SUPER_ADMIN'), InstitutionsController.list);

export default router;
