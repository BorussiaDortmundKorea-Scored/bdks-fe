/**
 * 작성자: KYD
 * 기능: 국가별 팀 수 세로 막대 차트
 * 프로세스 설명: 카드가 그리드 1~2행(가로로 넓고 세로로 낮은 칸)에 들어가 세로 막대로 그린다.
 *              국가 이름은 x축, 팀 수는 막대 위에 직접 적어 y축 눈금·격자를 없앴다.
 *              계열이 하나라 색은 공용 팔레트 주 계열 한 가지만 쓰고 범례는 두지 않는다.
 *              칸이 좁아 이름이 겹칠 땐 Chart.js 가 x축 라벨을 기울이고(최대 45도), "기타 n개국"처럼
 *              띄어쓰기가 있는 긴 이름은 두 줄로 나눈다. "기타" 막대는 툴팁에 묶인 국가 이름을 보여준다.
 */
import { Bar } from "react-chartjs-2";

import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  LinearScale,
  type Plugin,
  Tooltip,
  type TooltipItem,
} from "chart.js";

import type { ICountryBar } from "@admin/admin-team/admin-team-country-count/utils/group-top-countries";

import { CHART_COLOR, CHART_TOOLTIP_FONT, CHART_TOOLTIP_STYLE } from "@shared/constants/chart-palette";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip);

/** 막대 위 값 라벨과 막대 사이 간격(px) */
const VALUE_LABEL_GAP = 4;
/** 이 글자 수를 넘고 띄어쓰기가 있으면 x축 라벨을 두 줄로 나눈다 */
const WRAP_LABEL_LENGTH = 4;

/** 막대 위에 팀 수를 적는 이 차트 전용 플러그인 (전역 등록하지 않는다) */
const barValueLabelPlugin: Plugin<"bar"> = {
  id: "teamCountBarValueLabel",
  afterDatasetsDraw: (chart) => {
    const { ctx } = chart;
    const meta = chart.getDatasetMeta(0);
    ctx.save();
    ctx.fillStyle = CHART_COLOR.text;
    // 축 라벨과 같은 글꼴
    ctx.font = `600 12px ${ChartJS.defaults.font.family}`;
    ctx.textAlign = "center";
    ctx.textBaseline = "bottom";
    meta.data.forEach((bar, index) => {
      ctx.fillText(String(chart.data.datasets[0].data[index]), bar.x, bar.y - VALUE_LABEL_GAP);
    });
    ctx.restore();
  },
};

const toTickLabel = (label: string) =>
  label.length > WRAP_LABEL_LENGTH && label.includes(" ") ? label.split(" ") : label;

interface IAdminTeamCountryCountChartProps {
  bars: ICountryBar[];
}

const AdminTeamCountryCountChart = ({ bars }: IAdminTeamCountryCountChartProps) => {
  // 기타로 묶어도 합계는 그대로라 막대 합이 곧 전체 팀 수다 (툴팁 비율용)
  const totalTeamCount = bars.reduce((sum, bar) => sum + bar.teamCount, 0);

  const chartData = {
    labels: bars.map((bar) => toTickLabel(bar.label)),
    datasets: [
      {
        label: "팀 수",
        data: bars.map((bar) => bar.teamCount),
        backgroundColor: CHART_COLOR.primaryFill,
        borderColor: CHART_COLOR.primaryLine,
        borderWidth: 2,
        borderRadius: 4,
        borderSkipped: "start" as const,
        barPercentage: 0.6,
        maxBarThickness: 40,
        // 1팀짜리 막대가 납작한 선으로 보이지 않게 최소 높이(px)
        minBarLength: 8,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    // 가장 긴 막대 위 값 라벨이 잘리지 않게 위쪽 여백
    layout: { padding: { top: 18 } },
    plugins: {
      legend: { display: false },
      tooltip: {
        ...CHART_TOOLTIP_STYLE,
        displayColors: false,
        ...CHART_TOOLTIP_FONT,
        callbacks: {
          title: (items: TooltipItem<"bar">[]) => bars[items[0]?.dataIndex ?? 0]?.label ?? "",
          label: (item: TooltipItem<"bar">) => {
            const count = item.parsed.y ?? 0;
            const percent = totalTeamCount === 0 ? 0 : (count / totalTeamCount) * 100;
            return `${count.toLocaleString()}팀 · 전체의 ${percent.toFixed(1)}%`;
          },
          afterLabel: (item: TooltipItem<"bar">) => {
            const groupedNames = bars[item.dataIndex]?.groupedNames ?? [];
            return groupedNames.length > 0 ? groupedNames.join(", ") : "";
          },
        },
      },
    },
    scales: {
      x: {
        ticks: { color: CHART_COLOR.text, font: { size: 11 }, autoSkip: false, maxRotation: 45 },
        grid: { display: false },
        border: { color: CHART_COLOR.grid },
      },
      y: { display: false, beginAtZero: true },
    },
  };

  return (
    <div className="h-full min-h-0 w-full">
      <Bar data={chartData} options={chartOptions} plugins={[barValueLabelPlugin]} />
    </div>
  );
};

export default AdminTeamCountryCountChart;
