import { create } from 'zustand';
import { MarketingStrategy, PeriodType } from '../types';
import { strategyApi } from '../api/strategyApi';

interface StrategyFilters {
  periodType?: PeriodType;
  year?: number;
  quarter?: number;
  month?: number;
}

interface StrategyState {
  // Strategies list
  strategies: MarketingStrategy[];
  isLoading: boolean;
  error: string | null;

  // Current strategy being viewed
  currentStrategy: MarketingStrategy | null;

  // Filters
  filters: StrategyFilters;

  // Pagination
  pagination: {
    page: number;
    pageSize: number;
    totalPages: number;
    totalCount: number;
  };

  // Actions
  loadStrategies: (filters?: StrategyFilters) => Promise<void>;
  loadStrategy: (id: string) => Promise<void>;
  setFilters: (filters: StrategyFilters) => void;
  clearFilters: () => void;
  clearCurrentStrategy: () => void;
  clearError: () => void;
}

export const useStrategyStore = create<StrategyState>((set, get) => ({
  // Initial state
  strategies: [],
  isLoading: false,
  error: null,
  currentStrategy: null,
  filters: {},
  pagination: {
    page: 1,
    pageSize: 20,
    totalPages: 0,
    totalCount: 0,
  },

  // Load strategies with filters
  loadStrategies: async (filters?: StrategyFilters) => {
    try {
      set({ isLoading: true, error: null });

      const currentFilters = filters || get().filters;
      const response = await strategyApi.getStrategies({
        ...currentFilters,
        page: get().pagination.page,
        pageSize: get().pagination.pageSize,
      });

      set({
        strategies: response.data,
        pagination: response.pagination,
        isLoading: false,
      });
    } catch (error: any) {
      set({
        error: error.response?.data?.error || 'Failed to load strategies',
        isLoading: false,
      });
    }
  },

  // Load a specific strategy
  loadStrategy: async (id: string) => {
    try {
      set({ isLoading: true, error: null });

      const strategy = await strategyApi.getStrategy(id);
      set({
        currentStrategy: strategy,
        isLoading: false,
      });
    } catch (error: any) {
      set({
        error: error.response?.data?.error || 'Failed to load strategy',
        isLoading: false,
      });
      throw error;
    }
  },

  // Set filters and reload
  setFilters: async (filters: StrategyFilters) => {
    set({ filters });
    await get().loadStrategies(filters);
  },

  // Clear all filters
  clearFilters: () => {
    set({ filters: {} });
    get().loadStrategies({});
  },

  // Clear current strategy
  clearCurrentStrategy: () => {
    set({ currentStrategy: null });
  },

  // Clear error
  clearError: () => {
    set({ error: null });
  },
}));
