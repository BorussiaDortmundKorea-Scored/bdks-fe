import { API_ERROR_LOGO } from "@shared/constants/supabse-storage";

const MatchesHistoryErrorFallback = () => {
  return (
    <div
      data-testid="matches-history-error-fallback"
      className="flex w-full flex-col items-center justify-center gap-3 py-6 text-yds-c1m text-primary-100"
    >
      <img src={API_ERROR_LOGO} alt="에러" className="h-16 w-16" />
      경기 기록을 불러오지 못했습니다.
    </div>
  );
};

export default MatchesHistoryErrorFallback;
