/**
 * 작성자: KYD
 * 기능: Chart.js 차트 공용 팔레트
 * 프로세스 설명: 대시보드 차트 5종과 경기별 평점 차트가 같은 색을 쓰는데 파일마다 rgba 리터럴을
 *                따로 적어두어, 한 곳만 고치면 나머지가 조용히 어긋났다.
 *                모두 어두운 배경(--color-background-primary) 위에 올라가는 것을 전제로 한 값이다.
 */

/**
 * 도르트문트 옐로우(#FFCD00) + 블랙 팔레트.
 *
 * **채움 규칙: 면은 연하게(`*Fill`), 테두리는 진하게(`*Line`) 2px.**
 * 라인·막대·파이·도넛 전부 이 조합만 쓴다. 평점활동추이(스파크라인)에서 시작해
 * 회원 유형·경기별 참여율·평점현황 개수·평점 분포·회원 리텐션까지 모두 통일돼 있다.
 * 불투명하게 꽉 채우던 `primarySurface`/`secondarySurface` 는 쓰는 곳이 없어져 제거했으니
 * 되살리지 말 것 — 되살리면 이 규칙이 차트마다 어긋난다.
 */
export const CHART_COLOR = {
  /** 주 계열 선·테두리 */
  primaryLine: "rgba(255, 205, 0, 1)",
  /** 주 계열 면 — 선 아래 영역, 막대·조각 채움 */
  primaryFill: "rgba(255, 205, 0, 0.15)",
  /** 보조 계열 선·테두리 */
  secondaryLine: "rgba(0, 0, 0, 1)",
  /** 보조 계열 면 — 어두운 배경 위라 주 계열보다 조금 진하게 잡는다 */
  secondaryFill: "rgba(0, 0, 0, 0.35)",
  /** 축 눈금·범례 글자 */
  text: "#FFFFFF",
  /** 격자선 */
  grid: "rgba(255, 255, 255, 0.1)",
} as const;

/**
 * 툴팁 외형. 6개 차트가 글자 크기와 displayColors 만 다르고 나머지는 전부 같아서 공통분모만 모았다.
 * 쓰는 쪽에서 스프레드한 뒤 필요한 값을 덮어쓴다.
 */
export const CHART_TOOLTIP_STYLE = {
  enabled: true,
  backgroundColor: "rgba(0, 0, 0, 0.9)",
  titleColor: "#FFCD00",
  bodyColor: "#FFFFFF",
  borderColor: "#FFCD00",
  borderWidth: 2,
  padding: 12,
  /**
   * 툴팁 색상 박스 뒤에 까는 배경. **기본값이 흰색(`#fff`)이다.**
   *
   * Chart.js 는 반투명 색이 잘 섞이라고 색상 박스 아래에 이 색을 먼저 칠한다. 우리 면 색은
   * 반투명(`primaryFill` 0.15 / `secondaryFill` 0.35)이라 흰 바탕에 얹히면 노랑이 흰색으로,
   * 검정이 회색으로 보여서 차트 범례와 색이 달라진다.
   * 투명으로 두면 툴팁 자체의 어두운 배경 위에서 합성돼 범례와 같은 색으로 보인다.
   */
  multiKeyBackground: "rgba(0, 0, 0, 0)",
} as const;
