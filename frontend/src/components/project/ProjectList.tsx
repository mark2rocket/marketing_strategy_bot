import React from 'react';
import { Project } from '../../types';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';

interface ProjectListProps {
  projects: Project[];
  onEdit: (project: Project) => void;
  onDelete: (projectId: string) => void;
}

export const ProjectList: React.FC<ProjectListProps> = ({
  projects,
  onEdit,
  onDelete,
}) => {
  const getStatusVariant = (
    status: string
  ): 'primary' | 'success' | 'warning' | 'neutral' => {
    switch (status) {
      case 'IN_PROGRESS':
        return 'primary';
      case 'COMPLETED':
        return 'success';
      case 'ON_HOLD':
        return 'warning';
      default:
        return 'neutral';
    }
  };

  const getStatusLabel = (status: string): string => {
    const labels: { [key: string]: string } = {
      NOT_STARTED: '시작 전',
      IN_PROGRESS: '진행 중',
      COMPLETED: '완료',
      ON_HOLD: '보류',
    };
    return labels[status] || status;
  };

  if (projects.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <div className="text-6xl mb-4">📁</div>
        <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
          프로젝트가 없습니다
        </h3>
        <p className="text-gray-600 dark:text-gray-400 text-center max-w-md">
          새로운 프로젝트를 생성하여 작업을 시작하세요.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {projects.map((project) => (
        <Card key={project.id} className="p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  {project.name}
                </h3>
                <Badge variant={getStatusVariant(project.status)}>
                  {getStatusLabel(project.status)}
                </Badge>
              </div>
              {project.description && (
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                  {project.description}
                </p>
              )}
            </div>
            <div className="flex gap-2">
              <Button onClick={() => onEdit(project)} variant="outline" size="sm">
                수정
              </Button>
              <Button
                onClick={() => onDelete(project.id)}
                variant="danger"
                size="sm"
              >
                삭제
              </Button>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mb-4">
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-600 dark:text-gray-400">진행률</span>
              <span className="font-medium text-gray-900 dark:text-gray-100">
                {project.progress}%
              </span>
            </div>
            <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-primary-500 transition-all duration-300"
                style={{ width: `${project.progress}%` }}
              />
            </div>
          </div>

          {/* Metrics Grid */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
            <div>
              <div className="text-gray-600 dark:text-gray-400 mb-1">시작일</div>
              <div className="font-medium text-gray-900 dark:text-gray-100">
                {new Date(project.startDate).toLocaleDateString('ko-KR')}
              </div>
            </div>
            <div>
              <div className="text-gray-600 dark:text-gray-400 mb-1">종료일</div>
              <div className="font-medium text-gray-900 dark:text-gray-100">
                {new Date(project.endDate).toLocaleDateString('ko-KR')}
              </div>
            </div>
            <div>
              <div className="text-gray-600 dark:text-gray-400 mb-1">기간</div>
              <div className="font-medium text-gray-900 dark:text-gray-100">
                {project.durationMonths}개월
              </div>
            </div>
            <div>
              <div className="text-gray-600 dark:text-gray-400 mb-1">
                Man-Months
              </div>
              <div className="font-medium text-primary-600">
                {project.manMonths} MM
              </div>
            </div>
            <div>
              <div className="text-gray-600 dark:text-gray-400 mb-1">예산</div>
              <div className="font-medium text-gray-900 dark:text-gray-100">
                {project.budget
                  ? `${project.budget.toLocaleString()}원`
                  : '-'}
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};
