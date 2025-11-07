import React, { useState, useEffect } from 'react';
import { Project } from '../../types';
import { ProjectForm } from './ProjectForm';
import { ProjectList } from './ProjectList';
import { ResourceDashboard } from './ResourceDashboard';
import { Button } from '../ui/Button';

interface ProjectManagementProps {
  strategyId: string;
  initialProjects?: Project[];
  onProjectsChange?: (projects: Project[]) => void;
}

export const ProjectManagement: React.FC<ProjectManagementProps> = ({
  strategyId,
  initialProjects = [],
  onProjectsChange,
}) => {
  const [projects, setProjects] = useState<Project[]>(initialProjects);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | undefined>();
  const [activeView, setActiveView] = useState<'list' | 'dashboard'>('list');

  useEffect(() => {
    setProjects(initialProjects);
  }, [initialProjects]);

  const handleSaveProject = (projectData: Partial<Project>) => {
    if (editingProject) {
      // Update existing project
      const updatedProjects = projects.map((p) =>
        p.id === editingProject.id ? { ...p, ...projectData } : p
      );
      setProjects(updatedProjects);
      onProjectsChange?.(updatedProjects);
    } else {
      // Create new project
      const newProject: Project = {
        id: `temp-${Date.now()}`, // Temporary ID
        strategyId,
        name: projectData.name!,
        description: projectData.description,
        startDate: projectData.startDate!,
        endDate: projectData.endDate!,
        durationMonths: projectData.durationMonths!,
        manMonths: projectData.manMonths!,
        status: projectData.status || 'NOT_STARTED',
        progress: projectData.progress || 0,
        budget: projectData.budget,
        teamMembers: [],
      };

      const updatedProjects = [...projects, newProject];
      setProjects(updatedProjects);
      onProjectsChange?.(updatedProjects);
    }

    setIsFormOpen(false);
    setEditingProject(undefined);
  };

  const handleEditProject = (project: Project) => {
    setEditingProject(project);
    setIsFormOpen(true);
  };

  const handleDeleteProject = (projectId: string) => {
    if (confirm('이 프로젝트를 삭제하시겠습니까?')) {
      const updatedProjects = projects.filter((p) => p.id !== projectId);
      setProjects(updatedProjects);
      onProjectsChange?.(updatedProjects);
    }
  };

  const handleCancelForm = () => {
    setIsFormOpen(false);
    setEditingProject(undefined);
  };

  const handleCreateNew = () => {
    setEditingProject(undefined);
    setIsFormOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      {!isFormOpen && (
        <div className="flex items-center justify-between">
          <div className="flex gap-3">
            <Button
              onClick={() => setActiveView('list')}
              variant={activeView === 'list' ? 'primary' : 'outline'}
              size="sm"
            >
              프로젝트 목록
            </Button>
            <Button
              onClick={() => setActiveView('dashboard')}
              variant={activeView === 'dashboard' ? 'primary' : 'outline'}
              size="sm"
            >
              리소스 대시보드
            </Button>
          </div>
          <Button onClick={handleCreateNew} variant="primary" size="md">
            + 새 프로젝트
          </Button>
        </div>
      )}

      {/* Content */}
      {isFormOpen ? (
        <ProjectForm
          project={editingProject}
          strategyId={strategyId}
          onSave={handleSaveProject}
          onCancel={handleCancelForm}
        />
      ) : activeView === 'list' ? (
        <ProjectList
          projects={projects}
          onEdit={handleEditProject}
          onDelete={handleDeleteProject}
        />
      ) : (
        <ResourceDashboard projects={projects} />
      )}
    </div>
  );
};
