/**
 * 작성자: KYD
 * 기능: 팀 현황 요약 카드 스켈레톤
 */
import AdminTeamSummaryWrapper from "@admin/admin-team/admin-team-summary/components/wrapper/admin-team-summary-wrapper";

const AdminTeamSummarySkeleton = () => {
  return (
    <AdminTeamSummaryWrapper>
      <div
        data-testid="admin-team-summary-skeleton"
        className="grid w-full flex-1 grid-cols-3 items-center divide-x divide-white/10"
      >
        {Array.from({ length: 3 }).map((_, index) => (
          <div key={index} className="flex flex-col gap-1 px-4 first:pl-0 last:pr-0">
            <div className="h-4 w-14 animate-pulse rounded bg-white/5" />
            <div className="h-8 w-12 animate-pulse rounded bg-white/5" />
          </div>
        ))}
      </div>
    </AdminTeamSummaryWrapper>
  );
};

export default AdminTeamSummarySkeleton;
