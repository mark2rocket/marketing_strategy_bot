import { Router } from 'express';
import {
  strategyController,
  createStrategySchema,
  updateStrategySchema,
  getStrategiesQuerySchema,
} from '../controllers/strategyController';
import { authenticateToken } from '../middleware/auth';
import { validateBody, validateQuery } from '../utils/validation';
import { asyncHandler } from '../utils/asyncHandler';

const router = Router();

// All routes require authentication
router.use(authenticateToken);

// GET /api/strategies
router.get(
  '/',
  validateQuery(getStrategiesQuerySchema),
  asyncHandler(strategyController.getStrategies.bind(strategyController))
);

// POST /api/strategies
router.post(
  '/',
  validateBody(createStrategySchema),
  asyncHandler(strategyController.createStrategy.bind(strategyController))
);

// GET /api/strategies/:id
router.get(
  '/:id',
  asyncHandler(strategyController.getStrategy.bind(strategyController))
);

// PATCH /api/strategies/:id
router.patch(
  '/:id',
  validateBody(updateStrategySchema),
  asyncHandler(strategyController.updateStrategy.bind(strategyController))
);

// DELETE /api/strategies/:id
router.delete(
  '/:id',
  asyncHandler(strategyController.deleteStrategy.bind(strategyController))
);

export default router;
