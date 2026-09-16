/**
 * 작성자: KYD
 * 기능: 경기 시간별 평점 입력량 (세로 막대)
 * 프로세스 설명: 경기 전 → 전반 → 하프타임 → 후반 → 경기 종료 순서로, 팬들이 언제 평점을 남기는지 본다.
 *              RPC 가 phase_order 로 정렬해 주므로 순서를 FE 에서 다시 만들지 않는다.
 *              카드가 2행(약 104px)이라 축 글자를 10px 로 줄이고 y축 눈금 수를 제한한다.
 */
import { Bar } from "react-chartjs-2";

import { BarElement, CategoryScale, Chart as ChartJS, LinearScale, Tooltip, type TooltipItem } from "chart.js";

import { type IRatingPhaseBucket } from "@admin/admin-dashboard/admin-dashboard-rating-distribution/api/admin-dashboard-rating-distribution-api";

import { CHART_COLOR, CHART_TOOLTIP_STYLE } from "@shared/constants/chart-palette";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip);

interface IAdminDashboardRatingPhaseChart {
  data: IRatingPhaseBucket[];
}

const AdminDashboardRatingPhaseChart = ({ data }: IAdminDashboardRatingPhaseChart) => {
  const totalCount = data.reduce((sum, item) => sum + item.rating_count, 0);

  const chartData = {
    labels: data.map((item) => item.phase_label),
    datasets: [
      {
        label: "평점 건수",
        data: data.map((item) => item.rating_count),
        backgroundColor: CHART_COLOR.primaryFill,
        borderColor: CHART_COLOR.primaryLine,
        borderWidth: 2,
        borderRadius: 4,
        maxBarThickness: 36,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      // 단일 계열이라 범례를 두지 않는다 (카드 제목이 계열 이름 역할을 한다)
      legend: { display: false },
      tooltip: {
        ...CHART_TOOLTIP_STYLE,
        displayColors: false,
        titleFont: { size: 13, weight: "bold" as const },
        bodyFont: { size: 12 },
        callbacks: {
          label: (item: TooltipItem<"bar">) => {
            const count = item.parsed.y ?? 0;
            const percent = totalCount === 0 ? 0 : (count / totalCount) * 100;
            return `${count.toLocaleString()}건 (${percent.toFixed(1)}%)`;
          },
        },
      },
    },
    scales: {
      x: {
        ticks: { color: CHART_COLOR.text, font: { size: 10 }, maxRotation: 0, autoSkip: false },
        grid: { display: false },
      },
      y: {
        beginAtZero: true,
        ticks: {
          color: CHART_COLOR.text,
          font: { size: 10 },
          precision: 0,
          maxTicksLimit: 4,
          callback: (value: string | number) => `${Number(value).toLocaleString()}건`,
        },
        grid: { color: CHART_COLOR.grid },
      },
    },
  };

  return (
    <div className="h-full min-h-0 w-full">
      <Bar data={chartData} options={chartOptions} />
    </div>
  );
};

export default AdminDashboardRatingPhaseChart;
