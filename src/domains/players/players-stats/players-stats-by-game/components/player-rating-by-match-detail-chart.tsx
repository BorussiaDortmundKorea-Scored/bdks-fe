/**
 * 작성자: KYD
 * 기능: 경기별 선수 평점 세부 차트 컴포넌트
 * 프로세스 설명: 경기별 시간대별 평점 데이터를 차트로 표시 (내 평점 vs 나를 포함한 전체 회원 평균)
 *              디자인은 관리자 대시보드 차트 컨벤션(도르트문트 옐로우 + 다크 툴팁)을 따른다.
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
  Title,
  Tooltip,
  type TooltipItem,
} from "chart.js";

import { useAuth } from "@auth/contexts/AuthContext";

import { useGetPlayerRatingByMatchDetail } from "@players/players-stats/players-stats-by-game/api/react-query-api/use-get-player-rating-by-match-detail";

import { CHART_COLOR, CHART_TOOLTIP_STYLE } from "@shared/constants/chart-palette";

// Chart.js 필수 요소 등록 (영역 채우기를 위해 Filler 포함)
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Filler, Title, Tooltip, Legend);

const RATING_MAX = 10;

/**
 * ratings.minute 는 "경기 전" / "전반 15'" / "전반 45+2'" / "전반 종료" / "후반 10'" / "경기 종료" 형태다.
 * 숫자로 파싱되지 않아 문자열 정렬에 맡기면 "전반 4'" 가 "전반 41'" 뒤로 가므로 순서를 직접 매긴다.
 */
const FIXED_MINUTE_ORDER: Record<string, number> = {
  "경기 전": 0,
  "전반 종료": 2000,
  "경기 종료": 9999,
};
const HALF_ORDER_BASE: Record<string, number> = { 전반: 1000, 후반: 3000 };
const MINUTE_PATTERN = /^(전반|후반)\s(\d+)(?:\+(\d+))?'$/;

/**
 * 점이 하나뿐인 계열은 이을 상대가 없어 선이 그려지지 않는다.
 * 평점을 한 번만 남긴 경우가 전체의 9할이라 마커를 켜주지 않으면 화면에 아무것도 안 나온다.
 */
const getPointRadius = (values: (number | null)[]): number =>
  values.filter((value) => value !== null).length === 1 ? 4 : 0;

const getMinuteOrder = (minute: string): number => {
  const fixed = FIXED_MINUTE_ORDER[minute];
  if (fixed !== undefined) return fixed;

  const matched = MINUTE_PATTERN.exec(minute);
  // 추가시간("45+2'")은 같은 분의 정규 시간 바로 뒤에 오도록 분에 10을 곱해 자리를 비워둔다
  if (matched) return HALF_ORDER_BASE[matched[1]] + Number(matched[2]) * 10 + Number(matched[3] ?? 0);

  // 모르는 형식은 경기 종료 직전에 모아둔다
  return 9000;
};

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
  // other_ratings 는 RPC 변경 이후 "나를 포함한 전체 회원 평균" 이다 (키 이름은 배포 호환 때문에 유지)
  const allRatings = ratingDetails.other_ratings ?? [];

  // 모든 minute를 수집하여 경기 진행 순서대로 정렬
  const allMinutes = Array.from(new Set([...myRatings.map((r) => r.minute), ...allRatings.map((r) => r.minute)])).sort(
    (a, b) => getMinuteOrder(a) - getMinuteOrder(b) || a.localeCompare(b),
  );

  const myValues = allMinutes.map((minute) => myRatings.find((r) => r.minute === minute)?.avg_rating ?? null);
  const allValues = allMinutes.map((minute) => allRatings.find((r) => r.minute === minute)?.avg_rating ?? null);

  const chartData = {
    labels: allMinutes,
    datasets: [
      {
        label: "내 평점",
        data: myValues,
        borderColor: CHART_COLOR.primaryLine,
        backgroundColor: CHART_COLOR.primaryFill,
        borderWidth: 2,
        fill: true,
        tension: 0.4,
        spanGaps: true,
        // 점이 여러 개면 마커를 숨기고 hover 감지 영역만 확보 (매끈한 라인 + 툴팁)
        pointRadius: getPointRadius(myValues),
        pointHoverRadius: getPointRadius(myValues),
        pointHitRadius: 12,
      },
      {
        label: "보루센 평점",
        data: allValues,
        borderColor: CHART_COLOR.secondaryLine,
        backgroundColor: CHART_COLOR.secondaryFill,
        borderWidth: 2,
        fill: true,
        tension: 0.4,
        spanGaps: true,
        pointRadius: getPointRadius(allValues),
        pointHoverRadius: getPointRadius(allValues),
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
      legend: {
        display: true,
        position: "top" as const,
        labels: {
          color: CHART_COLOR.text,
          font: { size: 14 },
          padding: 16,
          usePointStyle: true,
          pointStyle: "rect",
        },
      },
      title: { display: false },
      tooltip: {
        ...CHART_TOOLTIP_STYLE,
        displayColors: true,
        titleFont: { size: 14, weight: "bold" as const },
        bodyFont: { size: 13 },
        callbacks: {
          // minute 는 "전반 15'" 처럼 그 자체로 완성된 표기라 접미사를 붙이지 않는다
          title: (items: TooltipItem<"line">[]) => {
            const index = items[0]?.dataIndex;
            if (index == null) return "";
            return allMinutes[index] ?? "";
          },
          label: (item: TooltipItem<"line">) => {
            const label = item.dataset.label ?? "";
            const value = item.parsed.y;
            if (value == null) return "";
            return `${label}: ${value.toFixed(1)}점`;
          },
        },
      },
    },
    scales: {
      x: {
        ticks: { color: CHART_COLOR.text, font: { size: 11 }, autoSkip: true },
        grid: { display: false },
      },
      y: {
        beginAtZero: true,
        max: RATING_MAX,
        ticks: {
          stepSize: 2,
          color: CHART_COLOR.text,
          font: { size: 12 },
          callback: (value: string | number) => `${value}점`,
        },
        grid: { color: CHART_COLOR.grid },
      },
    },
  };
  //!SECTION 상태값 영역

  //SECTION 메서드 영역

  //!SECTION 메서드 영역

  if (myRatings.length === 0 && allRatings.length === 0) {
    return (
      <div className="flex h-48 items-center justify-center">
        <p className="text-yds-c1m text-primary-100">평점 데이터가 없습니다.</p>
      </div>
    );
  }

  return (
    <div className="h-64 min-h-0 w-full">
      <Line data={chartData} options={chartOptions} />
    </div>
  );
};

export default PlayerRatingByMatchDetailChart;
