import React from 'react';
import { Project } from '../../types';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';

interface ResourceDashboardProps {
  projects: Project[];
}

interface ResourceMetrics {
  totalManMonths: number;
  totalBudget: number;
  averageDuration: number;
  projectCount: number;
  statusBreakdown: {
    NOT_STARTED: number;
    IN_PROGRESS: number;
    COMPLETED: number;
    ON_HOLD: number;
  };
  monthlyUtilization: Array<{
    month: string;
    manMonths: number;
    isBottleneck: boolean;
  }>;
}

export const ResourceDashboard: React.FC<ResourceDashboardProps> = ({
  projects,
}) => {
  const calculateMetrics = (): ResourceMetrics => {
    const totalManMonths = projects.reduce((sum, p) => sum + p.manMonths, 0);
    const totalBudget = projects.reduce((sum, p) => sum + (p.budget || 0), 0);
    const averageDuration =
      projects.length > 0
        ? projects.reduce((sum, p) => sum + p.durationMonths, 0) / projects.length
        : 0;

    const statusBreakdown = projects.reduce(
      (acc, p) => {
        acc[p.status] = (acc[p.status] || 0) + 1;
        return acc;
      },
      {
        NOT_STARTED: 0,
        IN_PROGRESS: 0,
        COMPLETED: 0,
        ON_HOLD: 0,
      } as ResourceMetrics['statusBreakdown']
    );

    // Calculate monthly utilization
    const monthlyData = new Map<string, number>();

    projects.forEach((project) => {
      const start = new Date(project.startDate);
      const end = new Date(project.endDate);

      let current = new Date(start);
      while (current <= end) {
        const key = `${current.getFullYear()}-${String(
          current.getMonth() + 1
        ).padStart(2, '0')}`;

        if (!monthlyData.has(key)) {
          monthlyData.set(key, 0);
        }

        const monthsInProject = project.durationMonths || 1;
        monthlyData.set(
          key,
          monthlyData.get(key)! + project.manMonths / monthsInProject
        );

        current.setMonth(current.getMonth() + 1);
      }
    });

    const monthlyUtilization = Array.from(monthlyData.entries())
      .sort((a, b) => a[0].localeCompare(b[0]))
      .map(([month, manMonths]) => ({
        month,
        manMonths: parseFloat(manMonths.toFixed(2)),
        isBottleneck: manMonths > 10, // Threshold: 10 MM
      }));

    return {
      totalManMonths,
      totalBudget,
      averageDuration,
      projectCount: projects.length,
      statusBreakdown,
      monthlyUtilization,
    };
  };

  const metrics = calculateMetrics();

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">
            총 프로젝트
          </div>
          <div className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            {metrics.projectCount}
          </div>
        </Card>

        <Card className="p-4">
          <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">
            총 Man-Months
          </div>
          <div className="text-3xl font-bold text-primary-600">
            {metrics.totalManMonths.toFixed(1)} MM
          </div>
        </Card>

        <Card className="p-4">
          <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">
            총 예산
          </div>
          <div className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            {(metrics.totalBudget / 1000000).toFixed(1)}M
          </div>
        </Card>

        <Card className="p-4">
          <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">
            평균 기간
          </div>
          <div className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            {metrics.averageDuration.toFixed(1)}개월
          </div>
        </Card>
      </div>

      {/* Status Breakdown */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
          프로젝트 상태
        </h3>
        <div className="grid grid-cols-4 gap-4">
          <div className="text-center p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
            <div className="text-2xl font-bold text-gray-600">
              {metrics.statusBreakdown.NOT_STARTED}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              시작 전
            </div>
          </div>
          <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">
              {metrics.statusBreakdown.IN_PROGRESS}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              진행 중
            </div>
          </div>
          <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
            <div className="text-2xl font-bold text-green-600">
              {metrics.statusBreakdown.COMPLETED}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              완료
            </div>
          </div>
          <div className="text-center p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
            <div className="text-2xl font-bold text-yellow-600">
              {metrics.statusBreakdown.ON_HOLD}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              보류
            </div>
          </div>
        </div>
      </Card>

      {/* Monthly Utilization */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
          월별 리소스 활용도
        </h3>

        {metrics.monthlyUtilization.length === 0 ? (
          <div className="text-center text-gray-500 py-8">
            리소스 데이터가 없습니다
          </div>
        ) : (
          <div className="space-y-2">
            {metrics.monthlyUtilization.map((item) => (
              <div
                key={item.month}
                className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-900 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium text-gray-900 dark:text-gray-100 w-24">
                    {item.month}
                  </span>
                  <div className="flex-1">
                    <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${
                          item.isBottleneck
                            ? 'bg-red-500'
                            : 'bg-primary-500'
                        } transition-all`}
                        style={{
                          width: `${Math.min((item.manMonths / 15) * 100, 100)}%`,
                        }}
                      />
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className={`text-sm font-semibold ${
                      item.isBottleneck
                        ? 'text-red-600'
                        : 'text-primary-600'
                    }`}
                  >
                    {item.manMonths} MM
                  </span>
                  {item.isBottleneck && (
                    <Badge variant="danger" className="text-xs">
                      병목
                    </Badge>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
          <p className="text-sm text-yellow-800 dark:text-yellow-200">
            ⚠️ 월 10 MM 이상은 병목 구간으로 표시됩니다. 리소스 재배치를 고려하세요.
          </p>
        </div>
      </Card>
    </div>
  );
};
