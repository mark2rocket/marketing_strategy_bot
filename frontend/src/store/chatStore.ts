import { create } from 'zustand';
import { ChatSession, ChatMessage, ExtractedData } from '../types';
import { chatApi } from '../api/chatApi';

interface ChatState {
  // Current session
  currentSession: ChatSession | null;
  messages: ChatMessage[];
  isLoading: boolean;
  error: string | null;

  // All sessions
  sessions: ChatSession[];
  isLoadingSessions: boolean;

  // Extracted data from current conversation
  extractedData: ExtractedData;

  // Actions
  createSession: (strategyId?: string, title?: string) => Promise<void>;
  loadSessions: () => Promise<void>;
  loadSession: (sessionId: string) => Promise<void>;
  sendMessage: (content: string) => Promise<void>;
  deleteSession: (sessionId: string) => Promise<void>;
  clearCurrentSession: () => void;
  clearError: () => void;
}

export const useChatStore = create<ChatState>((set, get) => ({
  // Initial state
  currentSession: null,
  messages: [],
  isLoading: false,
  error: null,
  sessions: [],
  isLoadingSessions: false,
  extractedData: {
    goals: null,
    kpis: null,
    actionItems: null,
    projects: null,
  },

  // Create a new chat session
  createSession: async (strategyId?: string, title?: string) => {
    try {
      set({ isLoading: true, error: null });

      const response = await chatApi.createSession({
        strategyId,
        title,
      });

      set({
        currentSession: response,
        messages: response.messages || [],
        isLoading: false,
      });

      // Reload sessions list
      await get().loadSessions();
    } catch (error: any) {
      set({
        error: error.response?.data?.error || 'Failed to create session',
        isLoading: false,
      });
      throw error;
    }
  },

  // Load all sessions for current user
  loadSessions: async () => {
    try {
      set({ isLoadingSessions: true, error: null });

      const response = await chatApi.getSessions();
      set({
        sessions: response.data,
        isLoadingSessions: false,
      });
    } catch (error: any) {
      set({
        error: error.response?.data?.error || 'Failed to load sessions',
        isLoadingSessions: false,
      });
    }
  },

  // Load a specific session with messages
  loadSession: async (sessionId: string) => {
    try {
      set({ isLoading: true, error: null });

      const response = await chatApi.getSession(sessionId);
      set({
        currentSession: response,
        messages: response.messages || [],
        isLoading: false,
      });
    } catch (error: any) {
      set({
        error: error.response?.data?.error || 'Failed to load session',
        isLoading: false,
      });
      throw error;
    }
  },

  // Send a message in current session
  sendMessage: async (content: string) => {
    const { currentSession } = get();

    if (!currentSession) {
      set({ error: 'No active session' });
      return;
    }

    try {
      set({ isLoading: true, error: null });

      const response = await chatApi.sendMessage(currentSession.id, {
        content,
      });

      // Add both user message and AI response to messages
      const newMessages = [
        ...get().messages,
        response.userMessage,
        response.aiMessage,
      ];

      set({
        messages: newMessages,
        isLoading: false,
      });

      // Update extracted data if available
      if (response.extractedData) {
        const currentExtracted = get().extractedData;
        set({
          extractedData: {
            goals:
              response.extractedData.goals || currentExtracted.goals,
            kpis:
              response.extractedData.kpis || currentExtracted.kpis,
            actionItems:
              response.extractedData.actionItems ||
              currentExtracted.actionItems,
            projects:
              response.extractedData.projects ||
              currentExtracted.projects,
          },
        });
      }
    } catch (error: any) {
      set({
        error: error.response?.data?.error || 'Failed to send message',
        isLoading: false,
      });
      throw error;
    }
  },

  // Delete a session
  deleteSession: async (sessionId: string) => {
    try {
      set({ isLoading: true, error: null });

      await chatApi.deleteSession(sessionId);

      // If deleting current session, clear it
      if (get().currentSession?.id === sessionId) {
        set({
          currentSession: null,
          messages: [],
          extractedData: {
            goals: null,
            kpis: null,
            actionItems: null,
            projects: null,
          },
        });
      }

      // Reload sessions list
      await get().loadSessions();
      set({ isLoading: false });
    } catch (error: any) {
      set({
        error: error.response?.data?.error || 'Failed to delete session',
        isLoading: false,
      });
      throw error;
    }
  },

  // Clear current session state
  clearCurrentSession: () => {
    set({
      currentSession: null,
      messages: [],
      extractedData: {
        goals: null,
        kpis: null,
        actionItems: null,
        projects: null,
      },
    });
  },

  // Clear error state
  clearError: () => {
    set({ error: null });
  },
}));
