/**
 * 작성자: KYD
 * 기능: 프로필 보유 유저의 로그인 유형(카카오/익명) 파이 차트 및 텍스트 표시
 */
import { Pie } from "react-chartjs-2";

import { useGetUserLoginTypeCountsSuspense } from "../api/react-query-api/use-get-user-login-type-counts";
import AdminDashboardUserLoginTypeWrapper from "./wrapper/admin-dashboard-user-login-type-wrapper";
import { ArcElement, Chart as ChartJS, Legend, Tooltip } from "chart.js";

import { CHART_COLOR, CHART_TOOLTIP_STYLE } from "@shared/constants/chart-palette";

ChartJS.register(ArcElement, Tooltip, Legend);

const AdminDashboardUserLoginType = () => {
  const { data: loginTypeCounts } = useGetUserLoginTypeCountsSuspense();

  const kakaoCount = Number(loginTypeCounts.find((item) => item.provider === "kakao")?.count ?? 0);
  const anonymousCount = Number(loginTypeCounts.find((item) => item.provider === "anonymous")?.count ?? 0);

  const chartData = {
    labels: ["카카오 로그인", "익명 로그인"],
    datasets: [
      {
        data: [kakaoCount, anonymousCount],
        // 평점활동추이·평점분포·리텐션과 같은 규칙: 면은 연하게, 테두리는 진하게 2px
        backgroundColor: [CHART_COLOR.primaryFill, CHART_COLOR.secondaryFill],
        borderColor: [CHART_COLOR.primaryLine, CHART_COLOR.secondaryLine],
        borderWidth: 2,
        // 기본값(center)이면 두 조각이 같은 경계선을 각자 칠해 나중에 그려지는 검정이 노랑을 덮는다.
        // inner 로 각자 안쪽에 칠하게 해야 카카오 조각이 노란 테두리로 닫힌다.
        borderAlign: "inner" as const,
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
          color: CHART_COLOR.text,
          font: { size: 14 },
          padding: 16,
          pointStyle: "rect",
          usePointStyle: true,
        },
      },
      tooltip: {
        ...CHART_TOOLTIP_STYLE,
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
      <div className="h-[120px] w-full">
        <Pie data={chartData} options={chartOptions} />
      </div>
    </AdminDashboardUserLoginTypeWrapper>
  );
};

export default AdminDashboardUserLoginType;
