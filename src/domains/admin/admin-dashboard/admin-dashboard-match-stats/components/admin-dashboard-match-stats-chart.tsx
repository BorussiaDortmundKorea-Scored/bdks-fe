/**
 * 작성자: KYD
 * 기능: 경기별 평점 통계 Bar 차트 컴포넌트
 * 프로세스 설명: Chart.js를 사용하여 경기별 유저 수와 평점 개수를 시각화
 */
import { Bar } from "react-chartjs-2";

import { useGetMatchStats } from "../api/react-query-api/use-get-match-stats";
import { BarElement, CategoryScale, Chart as ChartJS, Legend, LinearScale, Title, Tooltip } from "chart.js";

// Chart.js 필수 요소 등록
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const AdminDashboardMatchStatsChart = () => {
  const matchStats = useGetMatchStats();

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
        barThickness: 40,
      },
      {
        label: "총 평점 개수",
        data: matchStats.map((stat) => stat.total_rating_count),
        backgroundColor: "rgba(0, 0, 0, 0.8)", // 도르트문트 블랙
        borderColor: "rgba(0, 0, 0, 1)",
        borderWidth: 2,
        borderRadius: 4,
        barThickness: 40,
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
            size: 13,
            weight: "bold" as const,
          },
          padding: 15,
          usePointStyle: true,
          pointStyle: "rect",
        },
      },
      title: {
        display: true,
        text: "최근 10경기 평점 통계",
        color: "#FFCD00",
        font: {
          size: 18,
          weight: "bold" as const,
        },
        padding: {
          top: 10,
          bottom: 20,
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
          title: (context: any) => {
            // 툴팁에 전체 경기명 표시
            const index = context[0].dataIndex;
            return matchStats[index]?.match_name || "";
          },
          label: (context: any) => {
            const label = context.dataset.label || "";
            const value = context.parsed.y;
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
          maxRotation: 45,
          minRotation: 45,
          autoSkip: false,
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
          callback: function (value: any) {
            return value.toLocaleString() + "명";
          },
        },
        grid: {
          color: "rgba(255, 255, 255, 0.1)",
        },
      },
    },
  };

  return (
    <div className="h-[300px] w-full p-4 md:h-full md:w-full">
      <Bar data={chartData} options={chartOptions} />
    </div>
  );
};

export default AdminDashboardMatchStatsChart;
