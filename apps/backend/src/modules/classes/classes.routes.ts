import { Router } from 'express';
import { ClassesController } from './classes.controller';
import { authenticateJwt } from '../../common/guards/authGuard';

const router = Router();

router.get('/', authenticateJwt, ClassesController.list);

export default router;
