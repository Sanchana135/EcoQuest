import { Router } from 'express';
import { QuizzesController } from './quizzes.controller';
import { authenticateJwt } from '../../common/guards/authGuard';

const router = Router();

router.get('/', authenticateJwt, QuizzesController.list);
router.get('/my-attempts', authenticateJwt, QuizzesController.myAttempts);
router.get('/:id', authenticateJwt, QuizzesController.getById);
router.post('/:id/submit', authenticateJwt, QuizzesController.submit);

export default router;
