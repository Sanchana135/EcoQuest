import { Router } from 'express';
import { AuthController } from './auth.controller';
import { authenticateJwt } from '../../common/guards/authGuard';

const router = Router();

router.post('/login', AuthController.login);
router.post('/register', AuthController.register);
router.get('/me', authenticateJwt, AuthController.me);

export default router;
