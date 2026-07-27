import { Router } from 'express';
import { ModulesController } from './modules.controller';
import { authenticateJwt } from '../../common/guards/authGuard';
import { authorizeRoles } from '../../common/guards/rolesGuard';

const router = Router();

router.get('/', authenticateJwt, ModulesController.list);
router.get('/:id', authenticateJwt, ModulesController.getById);
router.post('/', authenticateJwt, authorizeRoles('ADMIN', 'TEACHER'), ModulesController.create);
router.post('/:id/lessons', authenticateJwt, authorizeRoles('ADMIN', 'TEACHER'), ModulesController.addLesson);

export default router;
