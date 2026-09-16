/**
 * 작성자: KYD
 * 기능: 회원 리텐션 퍼널 스켈레톤
 */
import AdminDashboardRetentionWrapper, {
  RETENTION_CHART_BOX_CLASS,
} from "../wrapper/admin-dashboard-retention-wrapper";

const AdminDashboardRetentionSkeleton = () => {
  return (
    <AdminDashboardRetentionWrapper summary={<div className="h-4 w-24 animate-pulse rounded bg-white/5" />}>
      <div data-testid="admin-dashboard-retention-skeleton" className={RETENTION_CHART_BOX_CLASS}>
        <div className="h-full w-full animate-pulse rounded-md bg-white/5" />
      </div>
    </AdminDashboardRetentionWrapper>
  );
};

export default AdminDashboardRetentionSkeleton;
