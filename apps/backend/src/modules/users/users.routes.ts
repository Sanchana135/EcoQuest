import { Router } from 'express';
import { UsersController } from './users.controller';
import { authenticateJwt } from '../../common/guards/authGuard';
import { authorizeRoles } from '../../common/guards/rolesGuard';

const router = Router();

router.get('/', authenticateJwt, authorizeRoles('ADMIN', 'TEACHER'), UsersController.list);

export default router;
