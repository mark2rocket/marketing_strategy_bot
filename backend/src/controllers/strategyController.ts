import { Request, Response } from 'express';
import { strategyService } from '../services/strategyService';
import { z } from 'zod';
import { PeriodType } from '@prisma/client';

// Validation schemas
export const createStrategySchema = z.object({
  periodType: z.enum(['YEARLY', 'QUARTERLY', 'MONTHLY']),
  year: z.number().min(2020).max(2100),
  quarter: z.number().min(1).max(4).optional(),
  month: z.number().min(1).max(12).optional(),
  title: z.string().min(1).max(200).optional(),
  description: z.string().optional(),
  totalBudget: z.number().positive().optional(),
});

export const updateStrategySchema = z.object({
  title: z.string().min(1).max(200).optional(),
  description: z.string().optional(),
  totalBudget: z.number().positive().optional(),
});

export const getStrategiesQuerySchema = z.object({
  periodType: z.enum(['YEARLY', 'QUARTERLY', 'MONTHLY']).optional(),
  year: z.string().transform(Number).optional(),
  quarter: z.string().transform(Number).optional(),
  month: z.string().transform(Number).optional(),
  page: z.string().transform(Number).optional(),
  limit: z.string().transform(Number).optional(),
});

export class StrategyController {
  async createStrategy(req: Request, res: Response) {
    if (!req.user) {
      throw new Error('User not authenticated');
    }

    const data = createStrategySchema.parse(req.body);
    const strategy = await strategyService.createStrategy({
      ...data,
      userId: req.user.userId,
    });

    res.status(201).json(strategy);
  }

  async getStrategies(req: Request, res: Response) {
    if (!req.user) {
      throw new Error('User not authenticated');
    }

    const filters = getStrategiesQuerySchema.parse(req.query);
    const result = await strategyService.getStrategies({
      ...filters,
      userId: req.user.userId,
    });

    res.status(200).json(result);
  }

  async getStrategy(req: Request, res: Response) {
    if (!req.user) {
      throw new Error('User not authenticated');
    }

    const { id } = req.params;
    const strategy = await strategyService.getStrategyById(id, req.user.userId);

    res.status(200).json(strategy);
  }

  async updateStrategy(req: Request, res: Response) {
    if (!req.user) {
      throw new Error('User not authenticated');
    }

    const { id } = req.params;
    const data = updateStrategySchema.parse(req.body);
    const strategy = await strategyService.updateStrategy(id, req.user.userId, data);

    res.status(200).json(strategy);
  }

  async deleteStrategy(req: Request, res: Response) {
    if (!req.user) {
      throw new Error('User not authenticated');
    }

    const { id } = req.params;
    const result = await strategyService.deleteStrategy(id, req.user.userId);

    res.status(200).json(result);
  }
}

export const strategyController = new StrategyController();
