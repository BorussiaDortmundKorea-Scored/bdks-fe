/**
 * 작성자: KYD
 * 기능: 평점 점수대 분포 히스토그램 (세로 막대)
 * 프로세스 설명: 0~10점 버킷별 입력 건수를 한 가지 색으로 그린다.
 *              크기 비교가 목적이라 막대마다 색을 나누지 않는다(계열색은 서로 다른 항목을 구분할 때만 쓴다).
 */
import { Bar } from "react-chartjs-2";

import { BarElement, CategoryScale, Chart as ChartJS, LinearScale, Tooltip, type TooltipItem } from "chart.js";

import { type IRatingDistributionBucket } from "@admin/admin-dashboard/admin-dashboard-rating-distribution/api/admin-dashboard-rating-distribution-api";

import { CHART_COLOR, CHART_TOOLTIP_STYLE } from "@shared/constants/chart-palette";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip);

/** 10 버킷만 만점(10.0)이라 "10점", 나머지는 "N점대" */
const formatBucketLabel = (bucket: number) => (bucket === 10 ? "10점" : `${bucket}점대`);

interface IAdminDashboardRatingDistributionChart {
  data: IRatingDistributionBucket[];
}

const AdminDashboardRatingDistributionChart = ({ data }: IAdminDashboardRatingDistributionChart) => {
  const totalCount = data.reduce((sum, item) => sum + item.rating_count, 0);

  const chartData = {
    labels: data.map((item) => formatBucketLabel(item.bucket)),
    datasets: [
      {
        label: "평점 건수",
        data: data.map((item) => item.rating_count),
        backgroundColor: CHART_COLOR.primaryFill,
        borderColor: CHART_COLOR.primaryLine,
        borderWidth: 2,
        borderRadius: 4,
        maxBarThickness: 28,
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

export default AdminDashboardRatingDistributionChart;
