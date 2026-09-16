/**
 * 작성자: KYD
 * 기능: 경기별 평점 통계 Bar 차트 컴포넌트
 * 프로세스 설명: Chart.js를 사용하여 경기별 유저 수와 평점 개수를 시각화.
 *              데이터가 날짜 오름차순이라 최신 경기가 오른쪽 끝에 오고, 최신부터 보는 일이 많아
 *              마운트 시 가로 스크롤을 오른쪽 끝으로 붙여 둔다.
 */
import { useLayoutEffect, useRef } from "react";
import { Bar } from "react-chartjs-2";

import { type IMatchStatsData } from "../api/admin-dashboard-match-stats-api";
import {
  type ActiveElement,
  BarElement,
  CategoryScale,
  type ChartEvent,
  Chart as ChartJS,
  Legend,
  LinearScale,
  Title,
  Tooltip,
  type TooltipItem,
} from "chart.js";

import { CHART_COLOR, CHART_TOOLTIP_STYLE } from "@shared/constants/chart-palette";

// Chart.js 필수 요소 등록
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const CHART_MIN_WIDTH_PX = 360;
const BAR_GROUP_WIDTH_PX = 90;

/** 계열 이름과 단위. 유저 수는 사람이라 '명', 평점은 건수라 '개' 로 센다 */
const USER_COUNT_SERIES = { label: "평점 입력 유저 수", unit: "명" } as const;
const RATING_COUNT_SERIES = { label: "총 평점 개수", unit: "개" } as const;

const SERIES_UNIT: Record<string, string> = {
  [USER_COUNT_SERIES.label]: USER_COUNT_SERIES.unit,
  [RATING_COUNT_SERIES.label]: RATING_COUNT_SERIES.unit,
};

export interface ISelectedMatch {
  match_id: string;
  match_name: string;
}

interface IAdminDashboardMatchStatsChart {
  /** 차트에 그릴 경기별 통계 데이터 */
  data: IMatchStatsData[];
  /** 막대(경기) 클릭 시 해당 경기 정보를 전달 */
  onBarClick?: (match: ISelectedMatch) => void;
}

const AdminDashboardMatchStatsChart = ({ data, onBarClick }: IAdminDashboardMatchStatsChart) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const matchStats = data;
  const chartMinWidthPx = Math.max(CHART_MIN_WIDTH_PX, matchStats.length * BAR_GROUP_WIDTH_PX);

  // 최신 경기(오른쪽 끝)부터 보이도록 초기 스크롤을 끝으로 보낸다.
  // 경기 목록이 바뀌면 다시 끝으로 붙인다. 이후 사용자가 스크롤한 위치는 건드리지 않는다.
  useLayoutEffect(() => {
    const element = scrollRef.current;
    if (!element) return;
    element.scrollLeft = element.scrollWidth;
  }, [chartMinWidthPx, matchStats.length]);

  // 차트 데이터 구성
  const chartData = {
    labels: matchStats.map((stat) => {
      // 경기명 축약 (너무 길면 줄여서 표시)
      const name = stat.opponent_name;
      return name.length > 30 ? name.substring(0, 30) + "..." : name;
    }),
    datasets: [
      {
        label: USER_COUNT_SERIES.label,
        data: matchStats.map((stat) => stat.unique_user_count),
        // 회원 유형·평점 분포·리텐션과 같은 규칙: 면은 연하게, 테두리는 진하게 2px
        backgroundColor: CHART_COLOR.primaryFill, // 도르트문트 옐로우
        borderColor: CHART_COLOR.primaryLine,
        borderWidth: 2,
        borderRadius: 4,
        barThickness: 20,
      },
      {
        label: RATING_COUNT_SERIES.label,
        data: matchStats.map((stat) => stat.total_rating_count),
        backgroundColor: CHART_COLOR.secondaryFill, // 도르트문트 블랙
        borderColor: CHART_COLOR.secondaryLine,
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
    onClick: (_event: ChartEvent, elements: ActiveElement[]) => {
      if (!onBarClick || elements.length === 0) return;
      const index = elements[0].index;
      const stat = matchStats[index];
      if (stat) onBarClick({ match_id: stat.match_id, match_name: stat.match_name });
    },
    onHover: (event: ChartEvent, elements: ActiveElement[]) => {
      const target = event.native?.target as HTMLElement | null;
      if (target) target.style.cursor = elements.length > 0 ? "pointer" : "default";
    },
    plugins: {
      legend: {
        position: "top" as const,
        labels: {
          color: CHART_COLOR.text,
          font: {
            size: 14,
          },
          padding: 16,
          usePointStyle: true,
          pointStyle: "rect",
        },
      },
      tooltip: {
        ...CHART_TOOLTIP_STYLE,
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
            const value = item.parsed.y ?? 0;
            // 유저 수는 '명', 평점 개수는 '개' — 두 계열의 단위가 다르다
            return `${label}: ${value.toLocaleString()}${SERIES_UNIT[label] ?? ""}`;
          },
        },
      },
    },
    scales: {
      x: {
        stacked: false,
        ticks: {
          color: CHART_COLOR.text,
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
          color: CHART_COLOR.text,
          font: {
            size: 12,
          },
          // 유저 수(명)와 평점 개수(개)가 한 축을 공유하므로 눈금에는 단위를 붙이지 않는다
          callback: (value: string | number) => Number(value).toLocaleString(),
        },
        grid: {
          color: CHART_COLOR.grid,
        },
      },
    },
  };

  return (
    <div ref={scrollRef} className="h-full min-h-0 w-full overflow-x-auto">
      <div className="h-full" style={{ minWidth: chartMinWidthPx }}>
        <Bar data={chartData} options={chartOptions} />
      </div>
    </div>
  );
};

export default AdminDashboardMatchStatsChart;
