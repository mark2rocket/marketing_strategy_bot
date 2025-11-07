import { Request, Response } from 'express';
import { authService } from '../services/authService';
import { z } from 'zod';

// Validation schemas
export const registerSchema = z.object({
  email: z.string().email('Invalid email format'),
  name: z.string().min(1, 'Name is required').max(100),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const loginSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(1, 'Password is required'),
});

export class AuthController {
  async register(req: Request, res: Response) {
    const data = registerSchema.parse(req.body);
    const result = await authService.register(data);

    res.status(201).json(result);
  }

  async login(req: Request, res: Response) {
    const data = loginSchema.parse(req.body);
    const result = await authService.login(data);

    res.status(200).json(result);
  }

  async getMe(req: Request, res: Response) {
    if (!req.user) {
      throw new Error('User not authenticated');
    }

    const user = await authService.getUserById(req.user.userId);
    res.status(200).json(user);
  }
}

export const authController = new AuthController();
