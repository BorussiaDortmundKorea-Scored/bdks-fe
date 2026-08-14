/**
 * 유로 금액(순수 유로 정수)을 밀리언/천 단위로 축약 표기
 * - 30000000 → "30M €"
 * - 32500000 → "32.5M €"
 * - 800000   → "800K €"
 * - 0        → "무료"
 * - null     → "비공개"
 */
export const formatEuroToMillion = (euro: number | null): string => {
  if (euro == null) return "비공개";
  if (euro === 0) return "무료";

  if (euro >= 1_000_000) {
    const million = euro / 1_000_000;
    return `${Number(million.toFixed(1))}M €`;
  }
  if (euro >= 1_000) {
    return `${Math.round(euro / 1_000)}K €`;
  }
  return `${euro.toLocaleString()} €`;
};
