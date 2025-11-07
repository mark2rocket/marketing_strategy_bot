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
import { KPI } from '../../types';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface KPIComparisonChartProps {
  kpis: KPI[];
}

export const KPIComparisonChart: React.FC<KPIComparisonChartProps> = ({
  kpis,
}) => {
  const chartData = useMemo(() => {
    return {
      labels: kpis.map((kpi) => kpi.name),
      datasets: [
        {
          label: '목표',
          data: kpis.map((kpi) => kpi.target),
          backgroundColor: 'rgba(99, 102, 241, 0.7)',
          borderColor: 'rgb(99, 102, 241)',
          borderWidth: 1,
        },
        {
          label: '현재',
          data: kpis.map((kpi) => kpi.currentValue || 0),
          backgroundColor: 'rgba(34, 197, 94, 0.7)',
          borderColor: 'rgb(34, 197, 94)',
          borderWidth: 1,
        },
      ],
    };
  }, [kpis]);

  const options: ChartOptions<'bar'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'KPI 목표 vs 현재',
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            const kpi = kpis[context.dataIndex];
            const value = context.parsed.y;
            const percentage =
              kpi.target > 0 ? ((value / kpi.target) * 100).toFixed(1) : '0';

            if (context.dataset.label === '현재') {
              return `${context.dataset.label}: ${value}${kpi.unit} (달성률: ${percentage}%)`;
            }
            return `${context.dataset.label}: ${value}${kpi.unit}`;
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: '값',
        },
      },
    },
  };

  if (kpis.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-500">
        KPI 데이터가 없습니다
      </div>
    );
  }

  return (
    <div className="h-96">
      <Bar data={chartData} options={options} />
    </div>
  );
};
