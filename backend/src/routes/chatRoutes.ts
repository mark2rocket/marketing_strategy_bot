import { Router } from 'express';
import {
  chatController,
  createSessionSchema,
  sendMessageSchema,
  expandIdeasSchema,
  organizeIdeasSchema,
} from '../controllers/chatController';
import { authenticateToken } from '../middleware/auth';
import { validateBody } from '../utils/validation';
import { asyncHandler } from '../utils/asyncHandler';

const router = Router();

// All routes require authentication
router.use(authenticateToken);

// GET /api/chat/sessions - Get all sessions
router.get(
  '/sessions',
  asyncHandler(chatController.getSessions.bind(chatController))
);

// POST /api/chat/sessions - Create new session
router.post(
  '/sessions',
  validateBody(createSessionSchema),
  asyncHandler(chatController.createSession.bind(chatController))
);

// GET /api/chat/sessions/:sessionId - Get session detail
router.get(
  '/sessions/:sessionId',
  asyncHandler(chatController.getSession.bind(chatController))
);

// DELETE /api/chat/sessions/:sessionId - Delete session
router.delete(
  '/sessions/:sessionId',
  asyncHandler(chatController.deleteSession.bind(chatController))
);

// POST /api/chat/sessions/:sessionId/messages - Send message
router.post(
  '/sessions/:sessionId/messages',
  validateBody(sendMessageSchema),
  asyncHandler(chatController.sendMessage.bind(chatController))
);

// GET /api/chat/sessions/:sessionId/messages - Get messages
router.get(
  '/sessions/:sessionId/messages',
  asyncHandler(chatController.getMessages.bind(chatController))
);

// POST /api/chat/expand-ideas - Expand ideas with AI
router.post(
  '/expand-ideas',
  validateBody(expandIdeasSchema),
  asyncHandler(chatController.expandIdeas.bind(chatController))
);

// POST /api/chat/organize-ideas - Organize ideas with AI
router.post(
  '/organize-ideas',
  validateBody(organizeIdeasSchema),
  asyncHandler(chatController.organizeIdeas.bind(chatController))
);

export default router;
