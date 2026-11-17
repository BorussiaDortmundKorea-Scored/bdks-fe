/**
 * 작성자: KYD
 * 기능: 국가별 팀 수 카드 스켈레톤
 */
import AdminTeamCountryCountWrapper from "@admin/admin-team/admin-team-country-count/components/wrapper/admin-team-country-count-wrapper";

const AdminTeamCountryCountSkeleton = () => {
  return (
    <AdminTeamCountryCountWrapper summary={<div className="h-4 w-20 animate-pulse rounded bg-white/5" />}>
      <div
        data-testid="admin-team-country-count-skeleton"
        className="h-full w-full animate-pulse rounded-md bg-white/5"
      />
    </AdminTeamCountryCountWrapper>
  );
};

export default AdminTeamCountryCountSkeleton;
