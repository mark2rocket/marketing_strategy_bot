import { Router } from 'express';
import { authController, registerSchema, loginSchema } from '../controllers/authController';
import { authenticateToken } from '../middleware/auth';
import { validateBody } from '../utils/validation';
import { asyncHandler } from '../utils/asyncHandler';

const router = Router();

// POST /api/auth/register
router.post(
  '/register',
  validateBody(registerSchema),
  asyncHandler(authController.register.bind(authController))
);

// POST /api/auth/login
router.post(
  '/login',
  validateBody(loginSchema),
  asyncHandler(authController.login.bind(authController))
);

// GET /api/auth/me
router.get(
  '/me',
  authenticateToken,
  asyncHandler(authController.getMe.bind(authController))
);

export default router;
