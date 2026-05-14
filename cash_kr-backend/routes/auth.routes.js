import { Router } from 'express';
import { body } from 'express-validator';
import { register, login, refresh, logout } from '../controllers/auth.controller.js';
import auth from '../middleware/auth.js';

const router = Router();

router.post('/register', [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('phone').trim().notEmpty().withMessage('Phone is required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
], register);

router.post('/login', [
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').notEmpty().withMessage('Password is required'),
], login);

router.post('/refresh', refresh);
router.post('/logout', auth, logout);

export default router;
