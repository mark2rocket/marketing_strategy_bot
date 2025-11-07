import React from 'react';
import { MarketingStrategy } from '../../types';
import { StrategyCard } from './StrategyCard';

interface StrategyListProps {
  strategies: MarketingStrategy[];
  onStrategyClick: (strategy: MarketingStrategy) => void;
}

export const StrategyList: React.FC<StrategyListProps> = ({
  strategies,
  onStrategyClick,
}) => {
  if (strategies.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <div className="text-6xl mb-4">📋</div>
        <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
          전략이 없습니다
        </h3>
        <p className="text-gray-600 dark:text-gray-400 text-center max-w-md">
          입력 탭에서 AI와 대화를 통해 새로운 마케팅 전략을 만들어보세요.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {strategies.map((strategy) => (
        <StrategyCard
          key={strategy.id}
          strategy={strategy}
          onClick={() => onStrategyClick(strategy)}
        />
      ))}
    </div>
  );
};
