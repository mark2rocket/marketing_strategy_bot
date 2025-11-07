import React from 'react';
import { MarketingStrategy } from '../../types';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';

interface StrategyCardProps {
  strategy: MarketingStrategy;
  onClick?: () => void;
}

export const StrategyCard: React.FC<StrategyCardProps> = ({
  strategy,
  onClick,
}) => {
  const formatPeriodLabel = (strategy: MarketingStrategy) => {
    if (strategy.periodType === 'yearly') {
      return `${strategy.year}년`;
    } else if (strategy.periodType === 'quarterly') {
      return `${strategy.year}년 ${strategy.quarter}분기`;
    } else if (strategy.periodType === 'monthly') {
      return `${strategy.year}년 ${strategy.month}월`;
    }
    return strategy.periodLabel;
  };

  const getPeriodTypeLabel = (type: string) => {
    const labels: { [key: string]: string } = {
      yearly: '연간',
      quarterly: '분기',
      monthly: '월간',
    };
    return labels[type] || type;
  };

  return (
    <Card
      className="p-6 hover:shadow-lg transition-shadow cursor-pointer"
      onClick={onClick}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Badge variant="primary">{getPeriodTypeLabel(strategy.periodType)}</Badge>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {formatPeriodLabel(strategy)}
            </span>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            {strategy.title || '제목 없음'}
          </h3>
        </div>
      </div>

      {/* Description */}
      {strategy.description && (
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
          {strategy.description}
        </p>
      )}

      {/* Budget */}
      {strategy.totalBudget && (
        <div className="mb-4">
          <span className="text-sm text-gray-600 dark:text-gray-400">총 예산: </span>
          <span className="text-lg font-semibold text-primary-600">
            {strategy.totalBudget.toLocaleString()}원
          </span>
        </div>
      )}

      {/* Metadata */}
      <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 pt-4 border-t border-gray-200 dark:border-gray-700">
        <span>
          생성일: {new Date(strategy.createdAt).toLocaleDateString('ko-KR')}
        </span>
        <span>
          수정일: {new Date(strategy.updatedAt).toLocaleDateString('ko-KR')}
        </span>
      </div>
    </Card>
  );
};
