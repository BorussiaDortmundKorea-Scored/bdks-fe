/**
 * 작성자: KYD
 * 기능: 팀 현황 요약 카드 에러 폴백
 */
import AdminTeamSummaryWrapper from "@admin/admin-team/admin-team-summary/components/wrapper/admin-team-summary-wrapper";

const AdminTeamSummaryErrorFallback = () => {
  return (
    <AdminTeamSummaryWrapper>
      <div data-testid="admin-team-summary-error" className="text-yds-c1m text-primary-100">
        팀 현황을 불러오지 못했습니다.
      </div>
    </AdminTeamSummaryWrapper>
  );
};

export default AdminTeamSummaryErrorFallback;
