import React, { useMemo } from 'react';
import { Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  ChartOptions,
} from 'chart.js';
import { Project } from '../../types';

// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend);

interface BudgetDistributionChartProps {
  projects: Project[];
}

export const BudgetDistributionChart: React.FC<
  BudgetDistributionChartProps
> = ({ projects }) => {
  const chartData = useMemo(() => {
    const projectsWithBudget = projects.filter((p) => p.budget && p.budget > 0);

    const colors = [
      'rgba(99, 102, 241, 0.7)',
      'rgba(239, 68, 68, 0.7)',
      'rgba(34, 197, 94, 0.7)',
      'rgba(251, 191, 36, 0.7)',
      'rgba(168, 85, 247, 0.7)',
      'rgba(236, 72, 153, 0.7)',
      'rgba(20, 184, 166, 0.7)',
      'rgba(248, 113, 113, 0.7)',
    ];

    return {
      labels: projectsWithBudget.map((p) => p.name),
      datasets: [
        {
          label: '예산',
          data: projectsWithBudget.map((p) => p.budget),
          backgroundColor: colors.slice(0, projectsWithBudget.length),
          borderColor: colors
            .slice(0, projectsWithBudget.length)
            .map((c) => c.replace('0.7', '1')),
          borderWidth: 1,
        },
      ],
    };
  }, [projects]);

  const options: ChartOptions<'pie'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right' as const,
      },
      title: {
        display: true,
        text: '프로젝트별 예산 배분',
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            const label = context.label || '';
            const value = context.parsed || 0;
            const total = context.dataset.data.reduce(
              (acc: number, val: any) => acc + (val || 0),
              0
            );
            const percentage = ((value / total) * 100).toFixed(1);
            return `${label}: ${value.toLocaleString()}원 (${percentage}%)`;
          },
        },
      },
    },
  };

  const projectsWithBudget = projects.filter((p) => p.budget && p.budget > 0);

  if (projectsWithBudget.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-500">
        예산 데이터가 없습니다
      </div>
    );
  }

  return (
    <div className="h-96">
      <Pie data={chartData} options={options} />
    </div>
  );
};
