import { PrismaClient, PeriodType } from '@prisma/client';
import { NotFoundError, ForbiddenError } from '../types/errors';

const prisma = new PrismaClient();

interface CreateStrategyData {
  userId: string;
  periodType: PeriodType;
  year: number;
  quarter?: number;
  month?: number;
  title?: string;
  description?: string;
  totalBudget?: number;
}

interface UpdateStrategyData {
  title?: string;
  description?: string;
  totalBudget?: number;
}

interface StrategyFilters {
  userId: string;
  periodType?: PeriodType;
  year?: number;
  quarter?: number;
  month?: number;
  page?: number;
  limit?: number;
}

export class StrategyService {
  async createStrategy(data: CreateStrategyData) {
    const { periodType, year, quarter, month } = data;

    // Generate periodLabel
    let periodLabel = `${year}`;
    if (periodType === 'QUARTERLY' && quarter) {
      periodLabel = `${year}-Q${quarter}`;
    } else if (periodType === 'MONTHLY' && month) {
      periodLabel = `${year}-${String(month).padStart(2, '0')}`;
    }

    const strategy = await prisma.marketingStrategy.create({
      data: {
        ...data,
        periodLabel,
      },
      include: {
        goals: true,
        targetAudience: true,
        channels: true,
        kpis: true,
        projects: {
          include: {
            tasks: true,
          },
        },
        actionItems: true,
      },
    });

    return strategy;
  }

  async getStrategies(filters: StrategyFilters) {
    const { userId, periodType, year, quarter, month, page = 1, limit = 10 } = filters;

    const where: any = { userId };

    if (periodType) where.periodType = periodType;
    if (year) where.year = year;
    if (quarter) where.quarter = quarter;
    if (month) where.month = month;

    const skip = (page - 1) * limit;

    const [strategies, total] = await Promise.all([
      prisma.marketingStrategy.findMany({
        where,
        skip,
        take: limit,
        orderBy: {
          createdAt: 'desc',
        },
        select: {
          id: true,
          periodType: true,
          year: true,
          quarter: true,
          month: true,
          periodLabel: true,
          title: true,
          totalBudget: true,
          createdAt: true,
          updatedAt: true,
        },
      }),
      prisma.marketingStrategy.count({ where }),
    ]);

    return {
      data: strategies,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getStrategyById(id: string, userId: string) {
    const strategy = await prisma.marketingStrategy.findUnique({
      where: { id },
      include: {
        goals: {
          orderBy: {
            order: 'asc',
          },
        },
        targetAudience: true,
        channels: true,
        kpis: true,
        projects: {
          include: {
            tasks: true,
          },
        },
        actionItems: {
          where: {
            projectId: null, // Only independent action items
          },
        },
      },
    });

    if (!strategy) {
      throw new NotFoundError('Strategy not found');
    }

    if (strategy.userId !== userId) {
      throw new ForbiddenError('Access denied');
    }

    return strategy;
  }

  async updateStrategy(id: string, userId: string, data: UpdateStrategyData) {
    // Check ownership
    await this.getStrategyById(id, userId);

    const strategy = await prisma.marketingStrategy.update({
      where: { id },
      data,
    });

    return strategy;
  }

  async deleteStrategy(id: string, userId: string) {
    // Check ownership
    await this.getStrategyById(id, userId);

    await prisma.marketingStrategy.delete({
      where: { id },
    });

    return { message: 'Strategy deleted successfully' };
  }
}

export const strategyService = new StrategyService();
