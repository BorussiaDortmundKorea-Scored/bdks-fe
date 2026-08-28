/**
 * 작성자: KYD
 * 기능: TOP PLAYERS 카드 에러 폴백
 */
import DashboardTopPlayersWrapper from "../wrapper/dashboard-top-players-wrapper";

const DashboardTopPlayersErrorFallback = () => {
  return (
    <DashboardTopPlayersWrapper>
      <p className="text-yds-c1m text-primary-100" data-testid="dashboard-top-players-error">
        TOP PLAYERS를 불러오지 못했습니다.
      </p>
    </DashboardTopPlayersWrapper>
  );
};

export default DashboardTopPlayersErrorFallback;
