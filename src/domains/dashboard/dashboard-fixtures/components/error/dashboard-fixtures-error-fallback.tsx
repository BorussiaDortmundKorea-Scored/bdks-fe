/**
 * 작성자: KYD
 * 기능: 경기 일정 위젯 에러 폴백
 */
import DashboardFixturesWrapper from "@dashboard/dashboard-fixtures/components/wrapper/dashboard-fixtures-wrapper";

const DashboardFixturesErrorFallback = () => {
  return (
    <DashboardFixturesWrapper>
      <p className="text-yds-c1m text-primary-100" data-testid="dashboard-fixtures-error">
        경기 일정을 불러오지 못했습니다.
      </p>
    </DashboardFixturesWrapper>
  );
};

export default DashboardFixturesErrorFallback;
