import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
} from 'chart.js';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import { ReportData, MisspellingHistoryReport } from '../types';
import { CHART_COLORS } from '../constants';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

interface ChartsProps {
  data: ReportData[];
}

export const Charts: React.FC<ChartsProps> = ({ data }) => {
  // Prepare trend data for history reports
  const historyData = data.filter(item => 
    item.id.startsWith('misspelling-history')
  ) as MisspellingHistoryReport[];

  const trendData = historyData
    .sort((a, b) => new Date(a.reportDate).getTime() - new Date(b.reportDate).getTime())
    .reduce((acc, item) => {
      const date = item.reportDate;
      if (!acc[date]) {
        acc[date] = { misspellings: 0, wordsToReview: 0 };
      }
      acc[date].misspellings += item.misspellings;
      acc[date].wordsToReview += item.wordsToReview;
      return acc;
    }, {} as Record<string, { misspellings: number; wordsToReview: number }>);

  const trendChartData = {
    labels: Object.keys(trendData),
    datasets: [
      {
        label: 'Misspellings',
        data: Object.values(trendData).map(d => d.misspellings),
        borderColor: CHART_COLORS.primary,
        backgroundColor: CHART_COLORS.primary + '20',
        tension: 0.4
      },
      {
        label: 'Words to Review',
        data: Object.values(trendData).map(d => d.wordsToReview),
        borderColor: CHART_COLORS.secondary,
        backgroundColor: CHART_COLORS.secondary + '20',
        tension: 0.4
      }
    ]
  };

  // Website distribution
  const websiteStats = data.reduce((acc, item) => {
    acc[item.website] = (acc[item.website] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const websiteChartData = {
    labels: Object.keys(websiteStats),
    datasets: [
      {
        data: Object.values(websiteStats),
        backgroundColor: [
          CHART_COLORS.primary,
          CHART_COLORS.secondary,
          CHART_COLORS.accent,
          CHART_COLORS.success,
          CHART_COLORS.warning
        ]
      }
    ]
  };

  // Report type distribution
  const reportTypeStats = data.reduce((acc, item) => {
    const type = item.id.split('-')[0] + '-' + item.id.split('-')[1];
    acc[type] = (acc[type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const reportTypeChartData = {
    labels: Object.keys(reportTypeStats).map(key => 
      key.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())
    ),
    datasets: [
      {
        data: Object.values(reportTypeStats),
        backgroundColor: [
          CHART_COLORS.purple,
          CHART_COLORS.pink,
          CHART_COLORS.accent,
          CHART_COLORS.success
        ]
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
    },
    scales: {
      y: {
        beginAtZero: true
      }
    }
  };

  const doughnutOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom' as const,
      },
    },
  };

  if (data.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <p className="text-gray-500 text-center">No data available for charts</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Trend Chart */}
      {Object.keys(trendData).length > 0 && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Misspellings Trend Over Time
          </h3>
          <div className="h-80">
            <Line data={trendChartData} options={chartOptions} />
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Website Distribution */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Records by Website
          </h3>
          <div className="h-80">
            <Doughnut data={websiteChartData} options={doughnutOptions} />
          </div>
        </div>

        {/* Report Type Distribution */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Records by Report Type
          </h3>
          <div className="h-80">
            <Doughnut data={reportTypeChartData} options={doughnutOptions} />
          </div>
        </div>
      </div>
    </div>
  );
};