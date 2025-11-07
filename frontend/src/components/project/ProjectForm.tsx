import React, { useState } from 'react';
import { Project } from '../../types';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Card } from '../ui/Card';

interface ProjectFormProps {
  project?: Project;
  strategyId: string;
  onSave: (data: Partial<Project>) => void;
  onCancel: () => void;
}

export const ProjectForm: React.FC<ProjectFormProps> = ({
  project,
  strategyId,
  onSave,
  onCancel,
}) => {
  const [formData, setFormData] = useState<Partial<Project>>({
    name: project?.name || '',
    description: project?.description || '',
    startDate: project?.startDate
      ? new Date(project.startDate).toISOString().split('T')[0]
      : '',
    endDate: project?.endDate
      ? new Date(project.endDate).toISOString().split('T')[0]
      : '',
    durationMonths: project?.durationMonths || 0,
    manMonths: project?.manMonths || 0,
    budget: project?.budget || 0,
    status: project?.status || 'NOT_STARTED',
    progress: project?.progress || 0,
    strategyId: project?.strategyId || strategyId,
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const handleChange = (
    field: keyof Project,
    value: string | number
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Clear error for this field
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }

    // Auto-calculate duration if dates change
    if (field === 'startDate' || field === 'endDate') {
      const start =
        field === 'startDate' ? new Date(value as string) : new Date(formData.startDate || '');
      const end =
        field === 'endDate' ? new Date(value as string) : new Date(formData.endDate || '');

      if (start && end && start <= end) {
        const diffTime = Math.abs(end.getTime() - start.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        const months = Math.ceil(diffDays / 30);

        setFormData((prev) => ({
          ...prev,
          durationMonths: months,
        }));
      }
    }
  };

  const validate = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.name?.trim()) {
      newErrors.name = '프로젝트 이름은 필수입니다';
    }

    if (!formData.startDate) {
      newErrors.startDate = '시작일은 필수입니다';
    }

    if (!formData.endDate) {
      newErrors.endDate = '종료일은 필수입니다';
    }

    if (formData.startDate && formData.endDate) {
      const start = new Date(formData.startDate);
      const end = new Date(formData.endDate);
      if (start > end) {
        newErrors.endDate = '종료일은 시작일 이후여야 합니다';
      }
    }

    if (!formData.durationMonths || formData.durationMonths <= 0) {
      newErrors.durationMonths = '기간은 0보다 커야 합니다';
    }

    if (!formData.manMonths || formData.manMonths <= 0) {
      newErrors.manMonths = 'Man-Months는 0보다 커야 합니다';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (validate()) {
      onSave(formData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
          {project ? '프로젝트 수정' : '새 프로젝트'}
        </h3>

        <div className="space-y-4">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              프로젝트 이름 *
            </label>
            <Input
              type="text"
              value={formData.name || ''}
              onChange={(e) => handleChange('name', e.target.value)}
              placeholder="예: 소셜 미디어 캠페인"
              required
            />
            {errors.name && (
              <p className="text-sm text-red-600 mt-1">{errors.name}</p>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              설명
            </label>
            <textarea
              value={formData.description || ''}
              onChange={(e) => handleChange('description', e.target.value)}
              placeholder="프로젝트 설명을 입력하세요"
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg
                       bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100
                       focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            />
          </div>

          {/* Dates */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                시작일 *
              </label>
              <Input
                type="date"
                value={formData.startDate || ''}
                onChange={(e) => handleChange('startDate', e.target.value)}
                required
              />
              {errors.startDate && (
                <p className="text-sm text-red-600 mt-1">{errors.startDate}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                종료일 *
              </label>
              <Input
                type="date"
                value={formData.endDate || ''}
                onChange={(e) => handleChange('endDate', e.target.value)}
                required
              />
              {errors.endDate && (
                <p className="text-sm text-red-600 mt-1">{errors.endDate}</p>
              )}
            </div>
          </div>

          {/* Duration and Man-Months */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                기간 (개월) *
              </label>
              <Input
                type="number"
                step="0.5"
                value={formData.durationMonths || ''}
                onChange={(e) =>
                  handleChange('durationMonths', parseFloat(e.target.value))
                }
                placeholder="3"
                required
              />
              {errors.durationMonths && (
                <p className="text-sm text-red-600 mt-1">
                  {errors.durationMonths}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Man-Months (MM) *
              </label>
              <Input
                type="number"
                step="0.5"
                value={formData.manMonths || ''}
                onChange={(e) =>
                  handleChange('manMonths', parseFloat(e.target.value))
                }
                placeholder="5"
                required
              />
              {errors.manMonths && (
                <p className="text-sm text-red-600 mt-1">{errors.manMonths}</p>
              )}
            </div>
          </div>

          {/* Budget */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              예산 (원)
            </label>
            <Input
              type="number"
              value={formData.budget || ''}
              onChange={(e) => handleChange('budget', parseInt(e.target.value))}
              placeholder="10000000"
            />
          </div>

          {/* Status */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              상태
            </label>
            <select
              value={formData.status || 'NOT_STARTED'}
              onChange={(e) => handleChange('status', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg
                       bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100
                       focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="NOT_STARTED">시작 전</option>
              <option value="IN_PROGRESS">진행 중</option>
              <option value="COMPLETED">완료</option>
              <option value="ON_HOLD">보류</option>
            </select>
          </div>

          {/* Progress */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              진행률 ({formData.progress || 0}%)
            </label>
            <input
              type="range"
              min="0"
              max="100"
              step="5"
              value={formData.progress || 0}
              onChange={(e) =>
                handleChange('progress', parseInt(e.target.value))
              }
              className="w-full"
            />
          </div>
        </div>
      </Card>

      {/* Actions */}
      <div className="flex gap-3 justify-end">
        <Button type="button" onClick={onCancel} variant="outline">
          취소
        </Button>
        <Button type="submit" variant="primary">
          {project ? '수정' : '생성'}
        </Button>
      </div>
    </form>
  );
};
