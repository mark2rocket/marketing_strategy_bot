export type PeriodType = 'yearly' | 'quarterly' | 'monthly';

export interface MarketingStrategy {
  id: string;
  userId: string;

  // 시간 단위 정보
  periodType: PeriodType;
  year: number;
  quarter?: number;
  month?: number;
  periodLabel: string;

  // 전략 정보
  title?: string;
  description?: string;
  totalBudget?: number;

  createdAt: string;
  updatedAt: string;
}

export interface Goal {
  id: string;
  strategyId: string;
  description: string;
  specific: string;
  measurable: string;
  achievable: boolean;
  relevant: string;
  timeBound: string;
  order: number;
}

export interface KPI {
  id: string;
  strategyId: string;
  name: string;
  target: number;
  unit: string;
  currentValue?: number;
  measurementMethod?: string;
}

export interface Project {
  id: string;
  strategyId: string;
  name: string;
  description?: string;

  // 기간 및 리소스
  startDate: string;
  endDate: string;
  durationMonths: number;
  manMonths: number;

  // 상태
  status: 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED' | 'ON_HOLD';
  progress: number;

  budget?: number;
  teamMembers?: string[];
}

export interface ActionItem {
  id: string;
  strategyId: string;
  projectId?: string;

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
}
