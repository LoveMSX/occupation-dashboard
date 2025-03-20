import { Chart } from './chart';
import type { ChartData } from 'chart.js';

interface ChartProps {
  data: {
    labels: string[];
    values: number[];
  };
  className?: string;
  options?: any; // Add options for chart customization
}

export const LineChart = ({ data, className }: ChartProps) => {
  const chartData: ChartData = {
    labels: data.labels,
    datasets: [{
      data: data.values,
      borderColor: 'rgb(75, 192, 192)',
      tension: 0.1
    }]
  };

  return (
    <Chart 
      type="line"
      data={chartData}
      options={{
        responsive: true,
        plugins: {
          legend: {
            display: false
          }
        }
      }}
    />
  );
};

export const BarChart = ({ data, className }: ChartProps) => {
  const chartData: ChartData = {
    labels: data.labels,
    datasets: [{
      data: data.values,
      backgroundColor: 'rgb(54, 162, 235)'
    }]
  };

  return (
    <Chart 
      type="bar"
      data={chartData}
      options={{
        responsive: true,
        plugins: {
          legend: {
            display: false
          }
        }
      }}
    />
  );
};

export const PieChart = ({ data, className }: ChartProps) => {
  const chartData: ChartData = {
    labels: data.labels,
    datasets: [{
      data: data.values,
      backgroundColor: [
        'rgb(255, 99, 132)',
        'rgb(54, 162, 235)',
        'rgb(255, 205, 86)',
        'rgb(75, 192, 192)',
        'rgb(153, 102, 255)'
      ]
    }]
  };

  return (
    <Chart 
      type="pie"
      data={chartData}
      options={{
        responsive: true
      }}
    />
  );
};