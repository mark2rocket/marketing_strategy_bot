import { Request, Response } from 'express';
import { chatService } from '../services/chatService';
import { z } from 'zod';

// Validation schemas
export const createSessionSchema = z.object({
  strategyId: z.string().uuid().optional(),
  title: z.string().min(1).max(200).optional(),
});

export const sendMessageSchema = z.object({
  content: z.string().min(1, 'Message content is required'),
});

export const expandIdeasSchema = z.object({
  idea: z.string().min(1, 'Idea is required'),
});

export const organizeIdeasSchema = z.object({
  ideas: z.array(z.string().min(1)).min(1, 'At least one idea is required'),
});

export class ChatController {
  async createSession(req: Request, res: Response) {
    if (!req.user) {
      throw new Error('User not authenticated');
    }

    const data = createSessionSchema.parse(req.body);
    const session = await chatService.createSession({
      ...data,
      userId: req.user.userId,
    });

    res.status(201).json(session);
  }

  async getSessions(req: Request, res: Response) {
    if (!req.user) {
      throw new Error('User not authenticated');
    }

    const sessions = await chatService.getSessions(req.user.userId);
    res.status(200).json({ data: sessions });
  }

  async getSession(req: Request, res: Response) {
    if (!req.user) {
      throw new Error('User not authenticated');
    }

    const { sessionId } = req.params;
    const session = await chatService.getSession(sessionId, req.user.userId);

    res.status(200).json(session);
  }

  async sendMessage(req: Request, res: Response) {
    if (!req.user) {
      throw new Error('User not authenticated');
    }

    const { sessionId } = req.params;
    const data = sendMessageSchema.parse(req.body);

    const result = await chatService.sendMessage({
      sessionId,
      userId: req.user.userId,
      content: data.content,
    });

    res.status(200).json(result);
  }

  async getMessages(req: Request, res: Response) {
    if (!req.user) {
      throw new Error('User not authenticated');
    }

    const { sessionId } = req.params;
    const messages = await chatService.getMessages(sessionId, req.user.userId);

    res.status(200).json({ data: messages });
  }

  async deleteSession(req: Request, res: Response) {
    if (!req.user) {
      throw new Error('User not authenticated');
    }

    const { sessionId } = req.params;
    const result = await chatService.deleteSession(sessionId, req.user.userId);

    res.status(200).json(result);
  }

  async expandIdeas(req: Request, res: Response) {
    if (!req.user) {
      throw new Error('User not authenticated');
    }

    const data = expandIdeasSchema.parse(req.body);
    const result = await chatService.expandIdeas(req.user.userId, data.idea);

    res.status(200).json(result);
  }

  async organizeIdeas(req: Request, res: Response) {
    if (!req.user) {
      throw new Error('User not authenticated');
    }

    const data = organizeIdeasSchema.parse(req.body);
    const result = await chatService.organizeIdeas(req.user.userId, data.ideas);

    res.status(200).json(result);
  }
}

export const chatController = new ChatController();
