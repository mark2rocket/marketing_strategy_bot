import React from 'react';
import { ExtractedData } from '../../types';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';

interface ExtractedDataPreviewProps {
  data: ExtractedData;
}

export const ExtractedDataPreview: React.FC<ExtractedDataPreviewProps> = ({
  data,
}) => {
  const hasAnyData =
    data.goals || data.kpis || data.actionItems || data.projects;

  if (!hasAnyData) {
    return (
      <Card className="h-full flex items-center justify-center">
        <div className="text-center p-8">
          <div className="text-5xl mb-4">📊</div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
            추출된 데이터 미리보기
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            대화를 진행하면 AI가 자동으로
            <br />
            목표, KPI, 액션 아이템, 프로젝트를 추출합니다
          </p>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-4 h-full overflow-y-auto">
      {/* Goals */}
      {data.goals && data.goals.length > 0 && (
        <Card className="p-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3 flex items-center gap-2">
            🎯 목표 (SMART)
            <Badge variant="primary">{data.goals.length}</Badge>
          </h3>
          <div className="space-y-3">
            {data.goals.map((goal, index) => (
              <div
                key={index}
                className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
              >
                <p className="font-medium text-gray-900 dark:text-gray-100 mb-2">
                  {goal.description}
                </p>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <span className="text-gray-600 dark:text-gray-400">구체성:</span>{' '}
                    <span className="text-gray-900 dark:text-gray-100">
                      {goal.specific}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-600 dark:text-gray-400">측정방법:</span>{' '}
                    <span className="text-gray-900 dark:text-gray-100">
                      {goal.measurable}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-600 dark:text-gray-400">달성가능:</span>{' '}
                    <Badge variant={goal.achievable ? 'success' : 'warning'}>
                      {goal.achievable ? '가능' : '검토필요'}
                    </Badge>
                  </div>
                  <div>
                    <span className="text-gray-600 dark:text-gray-400">기한:</span>{' '}
                    <span className="text-gray-900 dark:text-gray-100">
                      {goal.timeBound}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* KPIs */}
      {data.kpis && data.kpis.length > 0 && (
        <Card className="p-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3 flex items-center gap-2">
            📈 KPI
            <Badge variant="primary">{data.kpis.length}</Badge>
          </h3>
          <div className="space-y-2">
            {data.kpis.map((kpi, index) => (
              <div
                key={index}
                className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg flex items-center justify-between"
              >
                <div>
                  <p className="font-medium text-gray-900 dark:text-gray-100">
                    {kpi.name}
                  </p>
                  {kpi.measurementMethod && (
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {kpi.measurementMethod}
                    </p>
                  )}
                </div>
                <div className="text-right">
                  <p className="text-xl font-bold text-primary-600">
                    {kpi.target}
                    {kpi.unit}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Action Items */}
      {data.actionItems && data.actionItems.length > 0 && (
        <Card className="p-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3 flex items-center gap-2">
            ✅ 액션 아이템
            <Badge variant="primary">{data.actionItems.length}</Badge>
          </h3>
          <div className="space-y-2">
            {data.actionItems.map((item, index) => (
              <div
                key={index}
                className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
              >
                <div className="flex items-start justify-between mb-2">
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
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                    {item.description}
                  </p>
                )}
                <div className="flex gap-4 text-xs text-gray-600 dark:text-gray-400">
                  {item.dueDate && <span>기한: {item.dueDate}</span>}
                  {item.durationMonths && (
                    <span>기간: {item.durationMonths}개월</span>
                  )}
                  {item.manMonths && <span>MM: {item.manMonths}MM</span>}
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Projects */}
      {data.projects && data.projects.length > 0 && (
        <Card className="p-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3 flex items-center gap-2">
            🚀 프로젝트
            <Badge variant="primary">{data.projects.length}</Badge>
          </h3>
          <div className="space-y-2">
            {data.projects.map((project, index) => (
              <div
                key={index}
                className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
              >
                <p className="font-medium text-gray-900 dark:text-gray-100 mb-2">
                  {project.name}
                </p>
                {project.description && (
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                    {project.description}
                  </p>
                )}
                <div className="flex flex-wrap gap-3 text-xs">
                  {project.startDate && (
                    <span className="text-gray-600 dark:text-gray-400">
                      시작: {project.startDate}
                    </span>
                  )}
                  {project.endDate && (
                    <span className="text-gray-600 dark:text-gray-400">
                      종료: {project.endDate}
                    </span>
                  )}
                  <span className="text-gray-600 dark:text-gray-400">
                    기간: {project.durationMonths}개월
                  </span>
                  <span className="text-primary-600 font-medium">
                    MM: {project.manMonths}MM
                  </span>
                  {project.budget && (
                    <span className="text-gray-600 dark:text-gray-400">
                      예산: {project.budget.toLocaleString()}원
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
};
