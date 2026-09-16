/**
 * 작성자: KYD
 * 기능: 리텐션 퍼널 가로 막대 차트
 * 프로세스 설명: 단계 이름이 길어 가로 막대(indexAxis: y)로 그린다. 단계는 순서가 있는 한 줄기라
 *              막대 길이가 이미 크기를 말하므로 색은 한 가지만 쓴다.
 */
import { Bar } from "react-chartjs-2";

import { BarElement, CategoryScale, Chart as ChartJS, LinearScale, Tooltip, type TooltipItem } from "chart.js";

import { CHART_COLOR, CHART_TOOLTIP_STYLE } from "@shared/constants/chart-palette";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip);

export interface IRetentionStage {
  /** 축에 찍히는 짧은 이름 */
  label: string;
  /** 툴팁에 붙는 기준 설명 (예: "2경기 이상") */
  description: string;
  userCount: number;
}

interface IAdminDashboardRetentionChart {
  stages: IRetentionStage[];
}

const AdminDashboardRetentionChart = ({ stages }: IAdminDashboardRetentionChart) => {
  const totalUserCount = stages[0]?.userCount ?? 0;

  const chartData = {
    labels: stages.map((stage) => stage.label),
    datasets: [
      {
        label: "회원 수",
        data: stages.map((stage) => stage.userCount),
        backgroundColor: CHART_COLOR.primaryFill,
        borderColor: CHART_COLOR.primaryLine,
        borderWidth: 2,
        borderRadius: 4,
        maxBarThickness: 22,
      },
    ],
  };

  const chartOptions = {
    indexAxis: "y" as const,
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        ...CHART_TOOLTIP_STYLE,
        displayColors: false,
        titleFont: { size: 13, weight: "bold" as const },
        bodyFont: { size: 12 },
        callbacks: {
          title: (items: TooltipItem<"bar">[]) => {
            const stage = stages[items[0]?.dataIndex ?? 0];
            return stage ? `${stage.label} (${stage.description})` : "";
          },
          label: (item: TooltipItem<"bar">) => {
            const count = item.parsed.x ?? 0;
            const percent = totalUserCount === 0 ? 0 : (count / totalUserCount) * 100;
            return `${count.toLocaleString()}명 · 전체의 ${percent.toFixed(1)}%`;
          },
        },
      },
    },
    scales: {
      x: {
        beginAtZero: true,
        ticks: {
          color: CHART_COLOR.text,
          font: { size: 10 },
          precision: 0,
          callback: (value: string | number) => `${Number(value).toLocaleString()}명`,
        },
        grid: { color: CHART_COLOR.grid },
      },
      y: {
        ticks: { color: CHART_COLOR.text, font: { size: 10 } },
        grid: { display: false },
      },
    },
  };

  return (
    <div className="h-full min-h-0 w-full">
      <Bar data={chartData} options={chartOptions} />
    </div>
  );
};

export default AdminDashboardRetentionChart;
