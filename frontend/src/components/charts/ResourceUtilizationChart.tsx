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

interface ResourceUtilizationChartProps {
  projects: Project[];
}

interface MonthlyResource {
  month: string;
  manMonths: number;
  projects: string[];
}

export const ResourceUtilizationChart: React.FC<
  ResourceUtilizationChartProps
> = ({ projects }) => {
  const chartData = useMemo(() => {
    // Calculate monthly resource utilization
    const monthlyData = new Map<string, MonthlyResource>();

    projects.forEach((project) => {
      const start = new Date(project.startDate);
      const end = new Date(project.endDate);

      // Calculate months between start and end
      let current = new Date(start);
      while (current <= end) {
        const key = `${current.getFullYear()}-${String(
          current.getMonth() + 1
        ).padStart(2, '0')}`;

        if (!monthlyData.has(key)) {
          monthlyData.set(key, {
            month: key,
            manMonths: 0,
            projects: [],
          });
        }

        const data = monthlyData.get(key)!;
        // Distribute man-months evenly across project duration
        const monthsInProject = project.durationMonths || 1;
        data.manMonths += project.manMonths / monthsInProject;
        data.projects.push(project.name);

        current.setMonth(current.getMonth() + 1);
      }
    });

    // Sort by month
    const sortedData = Array.from(monthlyData.values()).sort((a, b) =>
      a.month.localeCompare(b.month)
    );

    // Define bottleneck threshold (e.g., 10 MM per month)
    const threshold = 10;

    return {
      labels: sortedData.map((d) => d.month),
      datasets: [
        {
          label: '월별 Man-Months',
          data: sortedData.map((d) => d.manMonths),
          backgroundColor: sortedData.map((d) =>
            d.manMonths > threshold
              ? 'rgba(239, 68, 68, 0.7)' // Red for bottleneck
              : 'rgba(99, 102, 241, 0.7)' // Blue for normal
          ),
          borderColor: sortedData.map((d) =>
            d.manMonths > threshold
              ? 'rgb(239, 68, 68)'
              : 'rgb(99, 102, 241)'
          ),
          borderWidth: 1,
        },
        {
          label: '병목 기준선 (10 MM)',
          data: sortedData.map(() => threshold),
          type: 'line' as const,
          borderColor: 'rgba(234, 179, 8, 1)',
          borderWidth: 2,
          borderDash: [5, 5],
          fill: false,
          pointRadius: 0,
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
        text: '월별 리소스 활용도 및 병목 구간',
      },
      tooltip: {
        callbacks: {
          afterLabel: (context) => {
            const monthlyData = Array.from(
              projects.reduce((map, project) => {
                const start = new Date(project.startDate);
                const end = new Date(project.endDate);
                let current = new Date(start);

                while (current <= end) {
                  const key = `${current.getFullYear()}-${String(
                    current.getMonth() + 1
                  ).padStart(2, '0')}`;

                  if (!map.has(key)) {
                    map.set(key, { projects: [] as string[] });
                  }
                  map.get(key)!.projects.push(project.name);
                  current.setMonth(current.getMonth() + 1);
                }
                return map;
              }, new Map())
            );

            const monthData = monthlyData[context.dataIndex];
            if (monthData && monthData[1].projects.length > 0) {
              return [
                '진행 프로젝트:',
                ...monthData[1].projects.map((p) => `- ${p}`),
              ];
            }
            return [];
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Man-Months (MM)',
        },
      },
      x: {
        title: {
          display: true,
          text: '월',
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
