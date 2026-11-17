/**
 * 작성자: KYD
 * 기능: 국가별 팀 수 카드 에러 폴백
 */
import AdminTeamCountryCountWrapper from "@admin/admin-team/admin-team-country-count/components/wrapper/admin-team-country-count-wrapper";

const AdminTeamCountryCountErrorFallback = () => {
  return (
    <AdminTeamCountryCountWrapper>
      <div data-testid="admin-team-country-count-error" className="text-yds-c1m text-primary-100">
        국가별 팀 수를 불러오지 못했습니다.
      </div>
    </AdminTeamCountryCountWrapper>
  );
};

export default AdminTeamCountryCountErrorFallback;
