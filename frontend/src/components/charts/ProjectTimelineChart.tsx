import React, { useMemo } from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions,
} from 'chart.js';
import { Project } from '../../types';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface ProjectTimelineChartProps {
  projects: Project[];
}

export const ProjectTimelineChart: React.FC<ProjectTimelineChartProps> = ({
  projects,
}) => {
  const chartData = useMemo(() => {
    const sortedProjects = [...projects].sort(
      (a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
    );

    return {
      labels: sortedProjects.map((p) => p.name),
      datasets: [
        {
          label: '진행 기간 (월)',
          data: sortedProjects.map((p) => p.durationMonths),
          backgroundColor: 'rgba(99, 102, 241, 0.7)',
          borderColor: 'rgb(99, 102, 241)',
          borderWidth: 1,
        },
        {
          label: 'Man-Months (MM)',
          data: sortedProjects.map((p) => p.manMonths),
          backgroundColor: 'rgba(239, 68, 68, 0.7)',
          borderColor: 'rgb(239, 68, 68)',
          borderWidth: 1,
        },
      ],
    };
  }, [projects]);

  const options: ChartOptions<'bar'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: '프로젝트 타임라인 및 리소스',
      },
      tooltip: {
        callbacks: {
          afterLabel: (context) => {
            const project = projects[context.dataIndex];
            return [
              `시작: ${new Date(project.startDate).toLocaleDateString('ko-KR')}`,
              `종료: ${new Date(project.endDate).toLocaleDateString('ko-KR')}`,
              `상태: ${project.status}`,
              `진행률: ${project.progress}%`,
            ];
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: '개월 / MM',
        },
      },
    },
  };

  if (projects.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-500">
        프로젝트 데이터가 없습니다
      </div>
    );
  }

  return (
    <div className="h-96">
      <Bar data={chartData} options={options} />
    </div>
  );
};
