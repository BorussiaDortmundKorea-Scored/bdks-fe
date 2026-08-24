/**
 * 작성자: KYD
 * 기능: PagedCard 한 페이지의 본문 - 축약 라벨 + 현재값 + 증감을 한 줄에 두고 아래에 스파크라인
 * 프로세스 설명: current/previous로 증감·증감률을 계산하고, series로 축 없는 라인 스파크라인을 렌더링.
 *              hover 시 각 지점의 라벨(월/경기)과 값을 툴팁으로 노출. 색상은 기존 대시보드 차트 컨벤션(도르트문트 옐로우).
 */
import { Line } from "react-chartjs-2";

import {
  CategoryScale,
  Chart as ChartJS,
  Filler,
  LineElement,
  LinearScale,
  PointElement,
  Tooltip,
  type TooltipItem,
} from "chart.js";

// 스파크라인(라인차트) 필수 요소 등록
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Filler, Tooltip);

// 기존 대시보드 차트와 동일한 팔레트 (도르트문트 옐로우)
const CHART_COLORS = {
  line: "rgba(255, 205, 0, 1)",
  fill: "rgba(255, 205, 0, 0.15)",
} as const;

interface IStatSparklineCardProps {
  label: string;
  current: number;
  previous: number;
  unit: string;
  series: number[];
  /** 각 지점 툴팁 제목 (월/경기명 등). series와 인덱스 매칭 */
  tooltipLabels: string[];
  caption?: string;
}

const StatSparklineCard = ({
  label,
  current,
  previous,
  unit,
  series,
  tooltipLabels,
  caption,
}: IStatSparklineCardProps) => {
  //SECTION 상태값 영역
  const delta = current - previous;
  const isRise = delta >= 0;
  // 직전 값이 0이면 증감률(%)은 의미가 없으므로 표시하지 않는다
  const percent = previous > 0 ? (delta / previous) * 100 : null;
  //!SECTION 상태값 영역

  const chartData = {
    labels: series.map((_, index) => index),
    datasets: [
      {
        data: series,
        borderColor: CHART_COLORS.line,
        backgroundColor: CHART_COLORS.fill,
        borderWidth: 2,
        fill: true,
        tension: 0.4,
        // 점 마커는 숨기고 hover 감지 영역만 확보 (매끈한 라인 + 툴팁)
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
        titleFont: { size: 13, weight: "bold" as const },
        bodyFont: { size: 13 },
        callbacks: {
          title: (items: TooltipItem<"line">[]) => {
            const index = items[0]?.dataIndex;
            if (index == null) return "";
            return tooltipLabels[index] ?? "";
          },
          label: (item: TooltipItem<"line">) => `${item.parsed.y.toLocaleString()}${unit}`,
        },
      },
    },
    scales: {
      x: { display: false },
      y: { display: false, beginAtZero: true },
    },
  };

  return (
    <div className="flex h-full w-full flex-col justify-center gap-3">
      {/* 축약 라벨 + 현재값 + 증감을 한 줄에 */}
      <div className="flex flex-wrap items-baseline gap-x-2">
        <span className="text-yds-c1m text-primary-100">{label}</span>
        <span className="text-yds-b1 font-bold text-white">
          {current.toLocaleString()}
          {unit}
        </span>
        <span className="text-yds-c1m text-primary-400 flex items-center gap-0.5">
          {isRise ? "▲" : "▼"} {Math.abs(delta).toLocaleString()}
          {percent !== null ? ` (${Math.abs(percent).toFixed(1)}%)` : ""}
        </span>
        {caption ? (
          <span className="text-primary-100 ml-auto truncate text-[11px] opacity-70">{caption}</span>
        ) : null}
      </div>

      <div className="h-[72px] w-full">
        <Line data={chartData} options={chartOptions} />
      </div>
    </div>
  );
};

export default StatSparklineCard;
