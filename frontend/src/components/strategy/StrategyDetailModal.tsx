import React, { useEffect, useState } from 'react';
import { MarketingStrategy, Goal, KPI, Project, ActionItem } from '../../types';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import {
  ProjectTimelineChart,
  BudgetDistributionChart,
  ResourceUtilizationChart,
  KPIComparisonChart,
} from '../charts';
import { strategyApi } from '../../api/strategyApi';

interface StrategyDetailModalProps {
  strategy: MarketingStrategy;
  onClose: () => void;
}

interface StrategyDetail extends MarketingStrategy {
  goals?: Goal[];
  kpis?: KPI[];
  projects?: Project[];
  actionItems?: ActionItem[];
}

export const StrategyDetailModal: React.FC<StrategyDetailModalProps> = ({
  strategy,
  onClose,
}) => {
  const [detailedStrategy, setDetailedStrategy] = useState<StrategyDetail | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'charts' | 'details'>(
    'overview'
  );

  useEffect(() => {
    const loadDetail = async () => {
      try {
        setIsLoading(true);
        const data = await strategyApi.getStrategy(strategy.id);
        setDetailedStrategy(data as StrategyDetail);
      } catch (error) {
        console.error('Failed to load strategy details:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadDetail();
  }, [strategy.id]);

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

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg w-full max-w-6xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="border-b border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="primary">
                  {strategy.periodType === 'yearly'
                    ? '연간'
                    : strategy.periodType === 'quarterly'
                    ? '분기'
                    : '월간'}
                </Badge>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {formatPeriodLabel(strategy)}
                </span>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {strategy.title || '제목 없음'}
              </h2>
              {strategy.description && (
                <p className="text-gray-600 dark:text-gray-400 mt-2">
                  {strategy.description}
                </p>
              )}
            </div>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 text-2xl"
            >
              ×
            </button>
          </div>

          {/* Tabs */}
          <div className="flex gap-4 mt-6">
            <button
              onClick={() => setActiveTab('overview')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                activeTab === 'overview'
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              개요
            </button>
            <button
              onClick={() => setActiveTab('charts')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                activeTab === 'charts'
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              차트
            </button>
            <button
              onClick={() => setActiveTab('details')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                activeTab === 'details'
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              상세
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <div className="flex flex-col items-center gap-4">
                <div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" />
                <p className="text-gray-600 dark:text-gray-400">로딩 중...</p>
              </div>
            </div>
          ) : (
            <>
              {/* Overview Tab */}
              {activeTab === 'overview' && detailedStrategy && (
                <div className="space-y-6">
                  {/* Summary Stats */}
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <Card className="p-4">
                      <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                        목표
                      </div>
                      <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                        {detailedStrategy.goals?.length || 0}개
                      </div>
                    </Card>
                    <Card className="p-4">
                      <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                        KPI
                      </div>
                      <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                        {detailedStrategy.kpis?.length || 0}개
                      </div>
                    </Card>
                    <Card className="p-4">
                      <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                        프로젝트
                      </div>
                      <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                        {detailedStrategy.projects?.length || 0}개
                      </div>
                    </Card>
                    <Card className="p-4">
                      <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                        총 예산
                      </div>
                      <div className="text-2xl font-bold text-primary-600">
                        {strategy.totalBudget?.toLocaleString() || 0}원
                      </div>
                    </Card>
                  </div>

                  {/* Goals */}
                  {detailedStrategy.goals && detailedStrategy.goals.length > 0 && (
                    <Card className="p-6">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                        🎯 목표 (SMART)
                      </h3>
                      <div className="space-y-4">
                        {detailedStrategy.goals.map((goal) => (
                          <div
                            key={goal.id}
                            className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg"
                          >
                            <p className="font-medium text-gray-900 dark:text-gray-100 mb-2">
                              {goal.description}
                            </p>
                            <div className="grid grid-cols-2 gap-2 text-sm">
                              <div>
                                <span className="text-gray-600 dark:text-gray-400">
                                  구체성:
                                </span>{' '}
                                {goal.specific}
                              </div>
                              <div>
                                <span className="text-gray-600 dark:text-gray-400">
                                  측정방법:
                                </span>{' '}
                                {goal.measurable}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </Card>
                  )}
                </div>
              )}

              {/* Charts Tab */}
              {activeTab === 'charts' && detailedStrategy && (
                <div className="space-y-6">
                  {/* KPI Chart */}
                  {detailedStrategy.kpis && detailedStrategy.kpis.length > 0 && (
                    <Card className="p-6">
                      <KPIComparisonChart kpis={detailedStrategy.kpis} />
                    </Card>
                  )}

                  {/* Projects Timeline */}
                  {detailedStrategy.projects &&
                    detailedStrategy.projects.length > 0 && (
                      <Card className="p-6">
                        <ProjectTimelineChart
                          projects={detailedStrategy.projects}
                        />
                      </Card>
                    )}

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Budget Distribution */}
                    {detailedStrategy.projects &&
                      detailedStrategy.projects.length > 0 && (
                        <Card className="p-6">
                          <BudgetDistributionChart
                            projects={detailedStrategy.projects}
                          />
                        </Card>
                      )}

                    {/* Resource Utilization */}
                    {detailedStrategy.projects &&
                      detailedStrategy.projects.length > 0 && (
                        <Card className="p-6">
                          <ResourceUtilizationChart
                            projects={detailedStrategy.projects}
                          />
                        </Card>
                      )}
                  </div>
                </div>
              )}

              {/* Details Tab */}
              {activeTab === 'details' && detailedStrategy && (
                <div className="space-y-6">
                  {/* Projects */}
                  {detailedStrategy.projects &&
                    detailedStrategy.projects.length > 0 && (
                      <Card className="p-6">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                          🚀 프로젝트
                        </h3>
                        <div className="space-y-4">
                          {detailedStrategy.projects.map((project) => (
                            <div
                              key={project.id}
                              className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg"
                            >
                              <div className="flex items-start justify-between mb-2">
                                <h4 className="font-medium text-gray-900 dark:text-gray-100">
                                  {project.name}
                                </h4>
                                <Badge
                                  variant={
                                    project.status === 'COMPLETED'
                                      ? 'success'
                                      : project.status === 'IN_PROGRESS'
                                      ? 'primary'
                                      : 'neutral'
                                  }
                                >
                                  {project.status}
                                </Badge>
                              </div>
                              {project.description && (
                                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                                  {project.description}
                                </p>
                              )}
                              <div className="flex flex-wrap gap-3 text-xs">
                                <span>
                                  기간: {project.durationMonths}개월
                                </span>
                                <span className="text-primary-600 font-medium">
                                  MM: {project.manMonths}MM
                                </span>
                                {project.budget && (
                                  <span>
                                    예산: {project.budget.toLocaleString()}원
                                  </span>
                                )}
                                <span>진행률: {project.progress}%</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </Card>
                    )}

                  {/* Action Items */}
                  {detailedStrategy.actionItems &&
                    detailedStrategy.actionItems.length > 0 && (
                      <Card className="p-6">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                          ✅ 액션 아이템
                        </h3>
                        <div className="space-y-2">
                          {detailedStrategy.actionItems.map((item) => (
                            <div
                              key={item.id}
                              className="p-3 bg-gray-50 dark:bg-gray-900 rounded-lg"
                            >
                              <div className="flex items-start justify-between">
                                <p className="font-medium text-gray-900 dark:text-gray-100">
                                  {item.title}
                                </p>
                                <Badge
                                  variant={
                                    item.priority === 'HIGH'
                                      ? 'danger'
                                      : item.priority === 'MEDIUM'
                                      ? 'warning'
                                      : 'neutral'
                                  }
                                >
                                  {item.priority}
                                </Badge>
                              </div>
                              {item.description && (
                                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                  {item.description}
                                </p>
                              )}
                            </div>
                          ))}
                        </div>
                      </Card>
                    )}
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 dark:border-gray-700 p-6 flex justify-end gap-3">
          <Button onClick={onClose} variant="outline">
            닫기
          </Button>
        </div>
      </div>
    </div>
  );
};
