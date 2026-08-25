/**
 * 작성자: KYD
 * 기능: 경기별 평점 참여율 추이 Line 차트
 * 프로세스 설명: 경기별 참여율(%)을 과거→최신 순 라인으로 그리고, hover 시 경기명/날짜/참여명수/참여율을 툴팁으로 표시
 */
import { Line } from "react-chartjs-2";

import {
  CategoryScale,
  Chart as ChartJS,
  Filler,
  Legend,
  LineElement,
  LinearScale,
  PointElement,
  Tooltip,
  type TooltipItem,
} from "chart.js";

import { type IMatchCoverageItem } from "../api/admin-dashboard-match-coverage-api";

// Line 차트 필수 요소 등록
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Filler, Tooltip, Legend);

// 기존 대시보드 차트와 동일한 팔레트 (도르트문트 옐로우)
const CHART_COLORS = {
  line: "rgba(255, 205, 0, 1)",
  fill: "rgba(255, 205, 0, 0.15)",
} as const;

interface IAdminDashboardMatchCoverageChartProps {
  data: IMatchCoverageItem[];
}

const AdminDashboardMatchCoverageChart = ({ data }: IAdminDashboardMatchCoverageChartProps) => {
  // 날짜 오름차순 정렬: 과거(좌) → 최신(우), 최신 경기가 오른쪽 끝에 오도록 (평점 활동 추이와 동일)
  const ordered = [...data].sort((a, b) => a.match_date.localeCompare(b.match_date));

  const chartData = {
    labels: ordered.map((item) => item.match_date.slice(5)), // MM-DD
    datasets: [
      {
        label: "참여율",
        data: ordered.map((item) => item.coverage_percent),
        borderColor: CHART_COLORS.line,
        backgroundColor: CHART_COLORS.fill,
        borderWidth: 2,
        fill: true,
        tension: 0.4,
        // 점 마커 미표시 (평점 활동 추이처럼 매끈한 라인). hover 시에도 점을 띄우지 않고 툴팁만 노출
        pointRadius: 0,
        pointHoverRadius: 0,
        pointHitRadius: 12,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: "index" as const,
      intersect: false,
    },
    plugins: {
      legend: { display: false },
      tooltip: {
        enabled: true,
        backgroundColor: "rgba(0, 0, 0, 0.9)",
        titleColor: "#FFCD00",
        bodyColor: "#FFFFFF",
        borderColor: "#FFCD00",
        borderWidth: 2,
        padding: 12,
        displayColors: false,
        titleFont: { size: 14, weight: "bold" as const },
        bodyFont: { size: 13 },
        callbacks: {
          // 경기명
          title: (items: TooltipItem<"line">[]) => {
            const index = items[0]?.dataIndex;
            if (index == null) return "";
            return ordered[index]?.opponent_name ?? "";
          },
          // 날짜 / 참여 명수 / 참여율(%)
          label: (item: TooltipItem<"line">) => {
            const target = ordered[item.dataIndex];
            if (!target) return "";
            return [
              target.match_date,
              `참여 ${target.participant_count}/${target.total_users}명`,
              `참여율 ${target.coverage_percent}%`,
            ];
          },
        },
      },
    },
    scales: {
      x: {
        ticks: { color: "#FFFFFF", font: { size: 11 }, autoSkip: true },
        grid: { display: false },
      },
      y: {
        beginAtZero: true,
        ticks: {
          color: "#FFFFFF",
          font: { size: 12 },
          callback: (value: string | number) => `${value}%`,
        },
        grid: { color: "rgba(255, 255, 255, 0.1)" },
      },
    },
  };

  return (
    <div className="h-[120px] w-full">
      <Line data={chartData} options={chartOptions} />
    </div>
  );
};

export default AdminDashboardMatchCoverageChart;
