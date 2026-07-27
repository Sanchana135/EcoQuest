import { Router } from 'express';
import { NotificationsController } from './notifications.controller';
import { authenticateJwt } from '../../common/guards/authGuard';

const router = Router();

router.get('/', authenticateJwt, NotificationsController.list);
router.patch('/read-all', authenticateJwt, NotificationsController.markAllRead);
router.patch('/:id/read', authenticateJwt, NotificationsController.markRead);

export default router;
