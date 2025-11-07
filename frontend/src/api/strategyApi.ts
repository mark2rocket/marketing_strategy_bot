import apiClient from './client';
import {
  MarketingStrategy,
  PeriodType,
  PaginatedResponse,
  ApiResponse,
} from '../types';

interface GetStrategiesParams {
  periodType?: PeriodType;
  year?: number;
  quarter?: number;
  month?: number;
  page?: number;
  pageSize?: number;
}

interface CreateStrategyRequest {
  periodType: PeriodType;
  year: number;
  quarter?: number;
  month?: number;
  title?: string;
  description?: string;
  totalBudget?: number;
  goals?: Array<{
    description: string;
    specific: string;
    measurable: string;
    achievable: boolean;
    relevant: string;
    timeBound: string;
    order: number;
  }>;
  kpis?: Array<{
    name: string;
    target: number;
    unit: string;
    currentValue?: number;
    measurementMethod?: string;
  }>;
  projects?: Array<{
    name: string;
    description?: string;
    startDate: string;
    endDate: string;
    durationMonths: number;
    manMonths: number;
    status: 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED' | 'ON_HOLD';
    progress: number;
    budget?: number;
    teamMembers?: string[];
  }>;
  actionItems?: Array<{
    title: string;
    description?: string;
    priority: 'HIGH' | 'MEDIUM' | 'LOW';
    startDate?: string;
    dueDate: string;
    durationMonths?: number;
    manMonths?: number;
    assignee?: string;
    status: 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED';
    progress?: number;
    projectId?: string;
  }>;
}

export const strategyApi = {
  // Get all strategies with optional filters
  getStrategies: async (
    params: GetStrategiesParams = {}
  ): Promise<PaginatedResponse<MarketingStrategy>> => {
    const response = await apiClient.get<PaginatedResponse<MarketingStrategy>>(
      '/strategies',
      { params }
    );
    return response.data;
  },

  // Get a specific strategy by ID
  getStrategy: async (id: string): Promise<MarketingStrategy> => {
    const response = await apiClient.get<MarketingStrategy>(`/strategies/${id}`);
    return response.data;
  },

  // Create a new strategy
  createStrategy: async (
    data: CreateStrategyRequest
  ): Promise<MarketingStrategy> => {
    const response = await apiClient.post<MarketingStrategy>('/strategies', data);
    return response.data;
  },

  // Update an existing strategy
  updateStrategy: async (
    id: string,
    data: Partial<CreateStrategyRequest>
  ): Promise<MarketingStrategy> => {
    const response = await apiClient.put<MarketingStrategy>(
      `/strategies/${id}`,
      data
    );
    return response.data;
  },

  // Delete a strategy
  deleteStrategy: async (id: string): Promise<ApiResponse<void>> => {
    const response = await apiClient.delete<ApiResponse<void>>(
      `/strategies/${id}`
    );
    return response.data;
  },
};
