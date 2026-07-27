import { Router } from 'express';
import { ReportsController } from './reports.controller';
import { authenticateJwt } from '../../common/guards/authGuard';
import { authorizeRoles } from '../../common/guards/rolesGuard';

const router = Router();

router.get('/student', authenticateJwt, ReportsController.getStudentReport);
router.get('/teacher', authenticateJwt, authorizeRoles('TEACHER', 'ADMIN'), ReportsController.getTeacherReport);
router.get('/parent', authenticateJwt, ReportsController.getParentReport);
router.get('/admin', authenticateJwt, authorizeRoles('ADMIN'), ReportsController.getAdminAnalytics);

export default router;
