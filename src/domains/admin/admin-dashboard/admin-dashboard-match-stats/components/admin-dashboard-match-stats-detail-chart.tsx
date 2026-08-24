/**
 * 작성자: KYD
 * 기능: 특정 경기의 유저별 평점 입력 횟수 Bar 차트 (세부 차트)
 * 프로세스 설명: 평점 입력 현황 차트에서 경기 막대를 클릭했을 때 노출되며,
 *              해당 경기에서 유저별로 몇 번 평점을 입력했는지 시각화한다.
 */
import { Bar } from "react-chartjs-2";

import { useGetMatchUserRatings } from "../api/react-query-api/use-get-match-user-ratings";
import { BarElement, CategoryScale, Chart as ChartJS, Legend, LinearScale, Title, Tooltip } from "chart.js";

// Chart.js 필수 요소 등록 (요약 차트와 동일, 중복 등록은 무해)
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const CHART_MIN_WIDTH_PX = 360;
const BAR_GROUP_WIDTH_PX = 48;

interface IAdminDashboardMatchStatsDetailChart {
  matchId: string;
}

const AdminDashboardMatchStatsDetailChart = ({ matchId }: IAdminDashboardMatchStatsDetailChart) => {
  const userRatings = useGetMatchUserRatings(matchId);
  const chartMinWidthPx = Math.max(CHART_MIN_WIDTH_PX, userRatings.length * BAR_GROUP_WIDTH_PX);

  if (userRatings.length === 0) {
    return <p className="text-yds-c1m text-primary-100">이 경기에 입력된 평점이 없습니다.</p>;
  }

  const chartData = {
    labels: userRatings.map((user) => {
      const name = user.nickname;
      return name.length > 12 ? name.substring(0, 12) + "..." : name;
    }),
    datasets: [
      {
        label: "유저별 평점 입력 횟수",
        data: userRatings.map((user) => user.rating_count),
        backgroundColor: "rgba(255, 205, 0, 0.8)", // 도르트문트 옐로우
        borderColor: "rgba(255, 205, 0, 1)",
        borderWidth: 2,
        borderRadius: 4,
        barThickness: 20,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top" as const,
        labels: {
          color: "#FFFFFF",
          font: { size: 14 },
          padding: 16,
          usePointStyle: true,
          pointStyle: "rect",
        },
      },
      tooltip: {
        enabled: true,
        backgroundColor: "rgba(0, 0, 0, 0.9)",
        titleColor: "#FFCD00",
        bodyColor: "#FFFFFF",
        borderColor: "#FFCD00",
        borderWidth: 2,
        padding: 12,
        callbacks: {
          label: (item: { dataset: { label?: string }; parsed: { y: number } }) => {
            const label = item.dataset.label ?? "";
            return `${label}: ${item.parsed.y}회`;
          },
        },
      },
    },
    scales: {
      x: {
        ticks: { color: "#FFFFFF", font: { size: 11 }, autoSkip: false },
        grid: { display: false },
      },
      y: {
        beginAtZero: true,
        ticks: {
          color: "#FFFFFF",
          font: { size: 12 },
          callback: (value: string | number) => {
            const parsed = typeof value === "number" ? value : Number(value);
            return Number.isNaN(parsed) ? `${value}회` : `${parsed.toLocaleString()}회`;
          },
        },
        grid: { color: "rgba(255, 255, 255, 0.1)" },
      },
    },
  };

  return (
    <div className="h-[240px] w-full overflow-x-auto">
      <div className="h-full" style={{ minWidth: chartMinWidthPx }}>
        <Bar data={chartData} options={chartOptions} />
      </div>
    </div>
  );
};

export default AdminDashboardMatchStatsDetailChart;
