// Re-export strategy types
export * from './strategy';

// Chat types
export type MessageRole = 'USER' | 'ASSISTANT' | 'SYSTEM';

export interface ChatSession {
  id: string;
  userId: string;
  strategyId?: string;
  title: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ChatMessage {
  id: string;
  sessionId: string;
  role: MessageRole;
  content: string;
  createdAt: string;
}

export interface ExtractedData {
  goals?: Array<{
    description: string;
    specific: string;
    measurable: string;
    achievable: boolean;
    relevant: string;
    timeBound: string;
  }> | null;
  kpis?: Array<{
    name: string;
    target: number;
    unit: string;
    measurementMethod?: string;
  }> | null;
  actionItems?: Array<{
    title: string;
    description?: string;
    priority: 'HIGH' | 'MEDIUM' | 'LOW';
    dueDate?: string;
    durationMonths?: number;
    manMonths?: number;
  }> | null;
  projects?: Array<{
    name: string;
    description?: string;
    startDate?: string;
    endDate?: string;
    durationMonths: number;
    manMonths: number;
    budget?: number;
  }> | null;
}

export interface SendMessageResponse {
  userMessage: ChatMessage;
  aiMessage: ChatMessage;
  extractedData: ExtractedData;
}

// Auth types
export interface User {
  userId: string;
  email: string;
  name: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  name: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

// API response types
export interface ApiResponse<T> {
  data?: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    pageSize: number;
    totalPages: number;
    totalCount: number;
  };
}
