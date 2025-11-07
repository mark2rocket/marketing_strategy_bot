import React, { useEffect, useState } from 'react';
import { useStrategyStore } from '../../store/strategyStore';
import { PeriodSelector } from './PeriodSelector';
import { StrategyList } from './StrategyList';
import { Button } from '../ui/Button';
import { MarketingStrategy, PeriodType } from '../../types';

export const SummaryTab: React.FC = () => {
  const {
    strategies,
    isLoading,
    filters,
    loadStrategies,
    setFilters,
    clearFilters,
  } = useStrategyStore();

  const [showFilters, setShowFilters] = useState(false);
  const [tempFilters, setTempFilters] = useState<{
    periodType: PeriodType;
    year: number;
    quarter?: number;
    month?: number;
  }>({
    periodType: 'quarterly',
    year: new Date().getFullYear(),
    quarter: Math.floor(new Date().getMonth() / 3) + 1,
  });

  useEffect(() => {
    loadStrategies();
  }, []);

  const handleApplyFilters = () => {
    setFilters({
      periodType: tempFilters.periodType,
      year: tempFilters.year,
      quarter: tempFilters.periodType === 'quarterly' ? tempFilters.quarter : undefined,
      month: tempFilters.periodType === 'monthly' ? tempFilters.month : undefined,
    });
    setShowFilters(false);
  };

  const handleClearFilters = () => {
    clearFilters();
    setTempFilters({
      periodType: 'quarterly',
      year: new Date().getFullYear(),
      quarter: Math.floor(new Date().getMonth() / 3) + 1,
    });
    setShowFilters(false);
  };

  const handleStrategyClick = (strategy: MarketingStrategy) => {
    // TODO: Navigate to strategy detail page or open modal
    console.log('Strategy clicked:', strategy);
  };

  const hasActiveFilters = filters.periodType || filters.year;

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              전략 요약
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              저장된 마케팅 전략을 확인하고 관리하세요
            </p>
          </div>
          <div className="flex gap-3">
            {hasActiveFilters && (
              <Button onClick={handleClearFilters} variant="outline" size="sm">
                필터 초기화
              </Button>
            )}
            <Button
              onClick={() => setShowFilters(!showFilters)}
              variant={showFilters ? 'primary' : 'outline'}
              size="sm"
            >
              {showFilters ? '필터 숨기기' : '필터 표시'}
            </Button>
          </div>
        </div>

        {/* Active Filters Display */}
        {hasActiveFilters && !showFilters && (
          <div className="flex items-center gap-2 text-sm">
            <span className="text-gray-600 dark:text-gray-400">활성 필터:</span>
            {filters.periodType && (
              <span className="px-2 py-1 bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300 rounded">
                {filters.periodType === 'yearly'
                  ? '연간'
                  : filters.periodType === 'quarterly'
                  ? '분기'
                  : '월간'}
              </span>
            )}
            {filters.year && (
              <span className="px-2 py-1 bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300 rounded">
                {filters.year}년
              </span>
            )}
            {filters.quarter && (
              <span className="px-2 py-1 bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300 rounded">
                {filters.quarter}분기
              </span>
            )}
            {filters.month && (
              <span className="px-2 py-1 bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300 rounded">
                {filters.month}월
              </span>
            )}
          </div>
        )}

        {/* Filter Panel */}
        {showFilters && (
          <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
            <PeriodSelector value={tempFilters} onChange={setTempFilters} />
            <div className="flex gap-3 mt-4">
              <Button onClick={handleApplyFilters} variant="primary" size="sm">
                필터 적용
              </Button>
              <Button
                onClick={() => setShowFilters(false)}
                variant="outline"
                size="sm"
              >
                취소
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Strategies List */}
      <div className="flex-1 overflow-y-auto bg-gray-50 dark:bg-gray-900 p-6">
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="flex flex-col items-center gap-4">
              <div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" />
              <p className="text-gray-600 dark:text-gray-400">로딩 중...</p>
            </div>
          </div>
        ) : (
          <StrategyList
            strategies={strategies}
            onStrategyClick={handleStrategyClick}
          />
        )}
      </div>
    </div>
  );
};
