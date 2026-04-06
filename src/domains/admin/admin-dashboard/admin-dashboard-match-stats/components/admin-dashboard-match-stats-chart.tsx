/**
 * 작성자: KYD
 * 기능: 경기별 평점 통계 Bar 차트 컴포넌트
 * 프로세스 설명: Chart.js를 사용하여 경기별 유저 수와 평점 개수를 시각화
 */
import { Bar } from "react-chartjs-2";

import { useGetMatchStats } from "../api/react-query-api/use-get-match-stats";
import { BarElement, CategoryScale, Chart as ChartJS, Legend, LinearScale, Title, Tooltip, type TooltipItem } from "chart.js";

// Chart.js 필수 요소 등록
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const CHART_MIN_WIDTH_PX = 360;
const BAR_GROUP_WIDTH_PX = 90;

const AdminDashboardMatchStatsChart = () => {
  const matchStats = useGetMatchStats();
  const chartMinWidthPx = Math.max(CHART_MIN_WIDTH_PX, matchStats.length * BAR_GROUP_WIDTH_PX);

  // 차트 데이터 구성
  const chartData = {
    labels: matchStats.map((stat) => {
      // 경기명 축약 (너무 길면 줄여서 표시)
      const name = stat.opponent_name;
      return name.length > 30 ? name.substring(0, 30) + "..." : name;
    }),
    datasets: [
      {
        label: "평점 입력 유저 수",
        data: matchStats.map((stat) => stat.unique_user_count),
        backgroundColor: "rgba(255, 205, 0, 0.8)", // 도르트문트 옐로우
        borderColor: "rgba(255, 205, 0, 1)",
        borderWidth: 2,
        borderRadius: 4,
        barThickness: 20,
      },
      {
        label: "총 평점 개수",
        data: matchStats.map((stat) => stat.total_rating_count),
        backgroundColor: "rgba(0, 0, 0, 0.8)", // 도르트문트 블랙
        borderColor: "rgba(0, 0, 0, 1)",
        borderWidth: 2,
        borderRadius: 4,
        barThickness: 20,
      },
    ],
  };

  // 차트 옵션
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: "index" as const,
      intersect: false,
    },
    plugins: {
      legend: {
        position: "top" as const,
        labels: {
          color: "#FFFFFF",
          font: {
            size: 14,
          },
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
        displayColors: true,
        titleFont: {
          size: 14,
          weight: "bold" as const,
        },
        bodyFont: {
          size: 13,
        },
        callbacks: {
          title: (items: TooltipItem<"bar">[]) => {
            const index = items[0]?.dataIndex;
            if (index == null) return "";
            return matchStats[index]?.match_name ?? "";
          },
          label: (item: TooltipItem<"bar">) => {
            const label = item.dataset.label ?? "";
            const value = item.parsed.y;
            return `${label}: ${value}명`;
          },
        },
      },
    },
    scales: {
      x: {
        stacked: false,
        ticks: {
          color: "#FFFFFF",
          font: {
            size: 11,
          },
          autoSkip: true,
        },
        grid: {
          display: false,
        },
      },
      y: {
        stacked: false,
        beginAtZero: true,
        ticks: {
          color: "#FFFFFF",
          font: {
            size: 12,
          },
          callback: (value: string | number) => {
            if (typeof value === "number") return `${value.toLocaleString()}명`;
            const parsed = Number(value);
            if (Number.isNaN(parsed)) return `${value}명`;
            return `${parsed.toLocaleString()}명`;
          },
        },
        grid: {
          color: "rgba(255, 255, 255, 0.1)",
        },
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

export default AdminDashboardMatchStatsChart;
