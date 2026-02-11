/**
 * 작성자: KYD
 * 기능: 프로필 보유 유저의 로그인 유형(카카오/익명) 파이 차트 및 텍스트 표시
 */
import { ArcElement, Chart as ChartJS, Legend, Tooltip } from "chart.js";
import { Pie } from "react-chartjs-2";

import { useGetUserLoginTypeCountsSuspense } from "../api/react-query-api/use-get-user-login-type-counts";
import AdminDashboardUserLoginTypeWrapper from "./wrapper/admin-dashboard-user-login-type-wrapper";

ChartJS.register(ArcElement, Tooltip, Legend);

const CHART_COLORS = {
  kakao: "rgba(255, 205, 0, 0.8)",
  kakaoBorder: "rgba(255, 205, 0, 1)",
  anonymous: "rgba(0, 0, 0, 0.8)",
  anonymousBorder: "rgba(0, 0, 0, 1)",
} as const;

const AdminDashboardUserLoginType = () => {
  const { data: loginTypeCounts } = useGetUserLoginTypeCountsSuspense();

  const kakaoCount = Number(loginTypeCounts.find((item) => item.provider === "kakao")?.count ?? 0);
  const anonymousCount = Number(loginTypeCounts.find((item) => item.provider === "anonymous")?.count ?? 0);

  const chartData = {
    labels: ["카카오 로그인", "익명 로그인"],
    datasets: [
      {
        data: [kakaoCount, anonymousCount],
        backgroundColor: [CHART_COLORS.kakao, CHART_COLORS.anonymous],
        borderColor: [CHART_COLORS.kakaoBorder, CHART_COLORS.anonymousBorder],
        borderWidth: 2,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "right" as const,
        labels: {
          color: "#FFFFFF",
          font: { size: 14, },
          padding: 12,
          usePointStyle: true,
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
          label: (context: { label: string; parsed: number; dataset: { data: number[] } }) => {
            const total = context.parsed;
            const sum = context.dataset.data.reduce((a, b) => a + b, 0);
            const pct = sum > 0 ? Math.round((total / sum) * 100) : 0;
            return `${context.label}: ${total}명 (${pct}%)`;
          },
        },
      },
    },
  };

  return (
    <AdminDashboardUserLoginTypeWrapper>
      <h2 className="text-yds-s2 mb-4">회원 유형</h2>
      <div className="h-[120px] w-full">
        <Pie data={chartData} options={chartOptions} />
      </div>
    </AdminDashboardUserLoginTypeWrapper>
  );
};

export default AdminDashboardUserLoginType;
