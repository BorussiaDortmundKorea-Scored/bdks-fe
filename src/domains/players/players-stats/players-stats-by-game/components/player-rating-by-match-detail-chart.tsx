/**
 * 작성자: KYD
 * 기능: 경기별 선수 평점 세부 차트 컴포넌트
 * 프로세스 설명: 경기별 시간대별 평점 데이터를 차트로 표시 (내 평점 vs 다른 회원들의 평점)
 */
import { Line } from "react-chartjs-2";

import {
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LineElement,
  LinearScale,
  PointElement,
  Title,
  Tooltip,
} from "chart.js";

import { useAuth } from "@auth/contexts/AuthContext";
import { useGetPlayerRatingByMatchDetail } from "@players/players-stats/players-stats-by-game/api/react-query-api/use-get-player-rating-by-match-detail";

// Chart.js 필수 요소 등록
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const CHART_COLORS = {
  myRating: "rgba(255, 205, 0, 0.8)",
  myRatingBorder: "rgba(255, 205, 0, 1)",
  otherRating: "rgba(0, 0, 0, 0.8)",
  otherRatingBorder: "rgba(0, 0, 0, 1)",
} as const;

interface PlayerRatingByMatchDetailChartProps {
  matchId: string;
  playerId: string;
}

const PlayerRatingByMatchDetailChart = ({ matchId, playerId }: PlayerRatingByMatchDetailChartProps) => {
  //SECTION HOOK호출 영역
  const { user } = useAuth();
  const { data: ratingDetails } = useGetPlayerRatingByMatchDetail({
    match_id: matchId,
    player_id: playerId,
    user_id: user!.id,
  });
  //!SECTION HOOK호출 영역

  //SECTION 상태값 영역
  const myRatings = ratingDetails.my_ratings ?? [];
  const otherRatings = ratingDetails.other_ratings ?? [];

  // 모든 minute를 수집하여 정렬
  const allMinutes = Array.from(
    new Set([...myRatings.map((r) => r.minute), ...otherRatings.map((r) => r.minute)]),
  ).sort((a, b) => {
    if (a === "경기 종료") return 1;
    if (b === "경기 종료") return -1;
    const aNum = parseInt(a, 10);
    const bNum = parseInt(b, 10);
    if (!isNaN(aNum) && !isNaN(bNum)) return aNum - bNum;
    return a.localeCompare(b);
  });

  const chartData = {
    labels: allMinutes,
    datasets: [
      {
        label: "내 평점",
        data: allMinutes.map((minute) => {
          const rating = myRatings.find((r) => r.minute === minute);
          return rating ? rating.avg_rating : null;
        }),
        borderColor: CHART_COLORS.myRatingBorder,
        backgroundColor: CHART_COLORS.myRating,
        tension: 0.1,
        spanGaps:true
      },
      {
        label: "보루센 평점",
        data: allMinutes.map((minute) => {
          const rating = otherRatings.find((r) => r.minute === minute);
          return rating ? rating.avg_rating : null;
        }),
        borderColor: CHART_COLORS.otherRatingBorder,
        backgroundColor: CHART_COLORS.otherRating,
        tension: 0.1,
        spanGaps:true
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: "top" as const,
        labels: {
          color: "#FFFFFF",
          font: { size: 14 },
          padding: 16,
          pointStyle: "rect",
          usePointStyle: true,
        },
      },
      title: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 10,
        ticks: {
          stepSize: 1,
          color: "#FFFFFF",
        },
        grid: {
          color: "rgba(255, 255, 255, 0.1)",
        },
      },
      x: {
        ticks: {
          color: "#FFFFFF",
        },
        grid: {
          color: "rgba(255, 255, 255, 0.1)",
        },
      },
    },
  };
  //!SECTION 상태값 영역

  //SECTION 메서드 영역

  //!SECTION 메서드 영역

  if (myRatings.length === 0 && otherRatings.length === 0) {
    return (
      <div className="flex h-48 items-center justify-center">
        <span className="text-yds-s2 text-gray-400">평점 데이터가 없습니다.</span>
      </div>
    );
  }

  return (
    <div className="h-64 w-full">
      <Line data={chartData} options={chartOptions} />
    </div>
  );
};

export default PlayerRatingByMatchDetailChart;
