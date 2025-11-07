import { PrismaClient, MessageRole } from '@prisma/client';
import { NotFoundError, ForbiddenError } from '../types/errors';
import { geminiService } from './geminiService';

const prisma = new PrismaClient();

interface CreateSessionData {
  userId: string;
  strategyId?: string;
  title?: string;
}

interface SendMessageData {
  sessionId: string;
  userId: string;
  content: string;
}

export class ChatService {
  async createSession(data: CreateSessionData) {
    const session = await prisma.chatSession.create({
      data: {
        userId: data.userId,
        strategyId: data.strategyId,
        title: data.title || '새로운 전략 수립',
        isActive: true,
        messages: {
          create: {
            role: MessageRole.SYSTEM,
            content: '안녕하세요! 마케팅 전략 수립을 도와드리겠습니다. 어떤 전략을 세우고 싶으신가요?',
          },
        },
      },
      include: {
        messages: {
          orderBy: {
            createdAt: 'asc',
          },
        },
      },
    });

    return session;
  }

  async getSessions(userId: string) {
    const sessions = await prisma.chatSession.findMany({
      where: {
        userId,
      },
      orderBy: {
        updatedAt: 'desc',
      },
      select: {
        id: true,
        title: true,
        isActive: true,
        strategyId: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return sessions;
  }

  async getSession(sessionId: string, userId: string) {
    const session = await prisma.chatSession.findUnique({
      where: { id: sessionId },
      include: {
        messages: {
          orderBy: {
            createdAt: 'asc',
          },
        },
      },
    });

    if (!session) {
      throw new NotFoundError('Chat session not found');
    }

    if (session.userId !== userId) {
      throw new ForbiddenError('Access denied');
    }

    return session;
  }

  async sendMessage(data: SendMessageData) {
    const { sessionId, userId, content } = data;

    // Verify session ownership
    const session = await this.getSession(sessionId, userId);

    // Save user message
    const userMessage = await prisma.chatMessage.create({
      data: {
        sessionId,
        role: MessageRole.USER,
        content,
      },
    });

    // Get conversation history for context
    const history = session.messages.map((msg) => ({
      role: msg.role === MessageRole.USER ? 'user' : 'model',
      parts: [{ text: msg.content }],
    }));

    // Get AI response
    const aiResponse = await geminiService.chat(content, history);

    // Save AI message
    const aiMessage = await prisma.chatMessage.create({
      data: {
        sessionId,
        role: MessageRole.ASSISTANT,
        content: aiResponse.text,
      },
    });

    // Update session timestamp
    await prisma.chatSession.update({
      where: { id: sessionId },
      data: { updatedAt: new Date() },
    });

    // Try to extract structured data
    const extractedData = await this.tryExtractData(session.messages, content);

    return {
      userMessage,
      aiMessage,
      extractedData,
    };
  }

  async getMessages(sessionId: string, userId: string) {
    // Verify ownership
    await this.getSession(sessionId, userId);

    const messages = await prisma.chatMessage.findMany({
      where: { sessionId },
      orderBy: {
        createdAt: 'asc',
      },
    });

    return messages;
  }

  async deleteSession(sessionId: string, userId: string) {
    // Verify ownership
    await this.getSession(sessionId, userId);

    await prisma.chatSession.delete({
      where: { id: sessionId },
    });

    return { message: 'Session deleted successfully' };
  }

  private async tryExtractData(messages: any[], latestUserMessage: string) {
    // Build conversation text from recent messages
    const recentMessages = messages.slice(-10); // Last 10 messages
    const conversationText = recentMessages
      .map((msg) => `${msg.role}: ${msg.content}`)
      .join('\n\n');

    const extractedData: any = {
      goals: null,
      kpis: null,
      actionItems: null,
      projects: null,
    };

    // Try to extract different types of data
    try {
      // Check if conversation mentions goals
      if (latestUserMessage.includes('목표') || latestUserMessage.includes('달성')) {
        const goalsData = await geminiService.extractData(conversationText, 'extract_goals');
        if (goalsData) {
          extractedData.goals = goalsData.goals;
        }
      }

      // Check if conversation mentions KPIs
      if (latestUserMessage.includes('지표') || latestUserMessage.includes('KPI') || latestUserMessage.includes('측정')) {
        const kpisData = await geminiService.extractData(conversationText, 'extract_kpis');
        if (kpisData) {
          extractedData.kpis = kpisData.kpis;
        }
      }

      // Check if conversation mentions action items
      if (latestUserMessage.includes('실행') || latestUserMessage.includes('과제') || latestUserMessage.includes('해야')) {
        const actionItemsData = await geminiService.extractData(conversationText, 'extract_action_items');
        if (actionItemsData) {
          extractedData.actionItems = actionItemsData.actionItems;
        }
      }

      // Check if conversation mentions projects
      if (latestUserMessage.includes('프로젝트') || latestUserMessage.includes('캠페인')) {
        const projectsData = await geminiService.extractData(conversationText, 'extract_projects');
        if (projectsData) {
          extractedData.projects = projectsData.projects;
        }
      }
    } catch (error) {
      console.error('Failed to extract data:', error);
      // Don't throw error, just return null for extracted data
    }

    return extractedData;
  }

  async expandIdeas(userId: string, idea: string) {
    const expanded = await geminiService.expandIdeas(idea);
    return { expanded };
  }

  async organizeIdeas(userId: string, ideas: string[]) {
    const organized = await geminiService.organizeIdeas(ideas);
    return { organized };
  }
}

export const chatService = new ChatService();
