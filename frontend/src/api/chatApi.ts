import apiClient from './client';
import {
  ChatSession,
  ChatMessage,
  SendMessageResponse,
  ApiResponse,
} from '../types';

interface CreateSessionRequest {
  strategyId?: string;
  title?: string;
}

interface SendMessageRequest {
  content: string;
}

interface ExpandIdeasRequest {
  idea: string;
}

interface OrganizeIdeasRequest {
  ideas: string[];
}

interface ExpandedIdeasResponse {
  expanded: string;
}

interface OrganizedIdeasResponse {
  organized: string;
}

export const chatApi = {
  // Create a new chat session
  createSession: async (
    data: CreateSessionRequest
  ): Promise<ChatSession & { messages?: ChatMessage[] }> => {
    const response = await apiClient.post<ChatSession>('/chat/sessions', data);
    return response.data;
  },

  // Get all sessions for the current user
  getSessions: async (): Promise<ApiResponse<ChatSession[]>> => {
    const response = await apiClient.get<ApiResponse<ChatSession[]>>(
      '/chat/sessions'
    );
    return response.data;
  },

  // Get a specific session with messages
  getSession: async (
    sessionId: string
  ): Promise<ChatSession & { messages: ChatMessage[] }> => {
    const response = await apiClient.get<
      ChatSession & { messages: ChatMessage[] }
    >(`/chat/sessions/${sessionId}`);
    return response.data;
  },

  // Delete a session
  deleteSession: async (sessionId: string): Promise<ApiResponse<void>> => {
    const response = await apiClient.delete<ApiResponse<void>>(
      `/chat/sessions/${sessionId}`
    );
    return response.data;
  },

  // Send a message in a session
  sendMessage: async (
    sessionId: string,
    data: SendMessageRequest
  ): Promise<SendMessageResponse> => {
    const response = await apiClient.post<SendMessageResponse>(
      `/chat/sessions/${sessionId}/messages`,
      data
    );
    return response.data;
  },

  // Get messages for a session
  getMessages: async (sessionId: string): Promise<ApiResponse<ChatMessage[]>> => {
    const response = await apiClient.get<ApiResponse<ChatMessage[]>>(
      `/chat/sessions/${sessionId}/messages`
    );
    return response.data;
  },

  // Expand ideas with AI
  expandIdeas: async (data: ExpandIdeasRequest): Promise<ExpandedIdeasResponse> => {
    const response = await apiClient.post<ExpandedIdeasResponse>(
      '/chat/expand-ideas',
      data
    );
    return response.data;
  },

  // Organize ideas with AI
  organizeIdeas: async (
    data: OrganizeIdeasRequest
  ): Promise<OrganizedIdeasResponse> => {
    const response = await apiClient.post<OrganizedIdeasResponse>(
      '/chat/organize-ideas',
      data
    );
    return response.data;
  },
};
