/**
 * 작성자: KYD
 * 기능: 회원 리텐션 퍼널 - 가입에서 핵심 회원까지 단계별 인원
 * 프로세스 설명: get_user_retention_funnel 결과를 4단계 가로 막대로 렌더한다.
 *              재방문/핵심 기준은 "가입 이후 열린 경기(기회) 대비 참여율"이고, 임계값은 RPC가 내려준다.
 */
import { useGetRetentionFunnel } from "@admin/admin-dashboard/admin-dashboard-retention/api/react-query-api/use-get-retention-funnel";
import AdminDashboardRetentionChart, {
  type IRetentionStage,
} from "@admin/admin-dashboard/admin-dashboard-retention/components/admin-dashboard-retention-chart";
import AdminDashboardRetentionWrapper, {
  RETENTION_CHART_BOX_CLASS,
} from "@admin/admin-dashboard/admin-dashboard-retention/components/wrapper/admin-dashboard-retention-wrapper";

const AdminDashboardRetention = () => {
  //SECTION HOOK호출 영역
  const funnel = useGetRetentionFunnel();
  //!SECTION HOOK호출 영역

  //SECTION 상태값 영역
  const stages: IRetentionStage[] = [
    { label: "가입 회원", description: "전체 회원", userCount: funnel.total_users },
    { label: "활성 회원", description: "평점 1회 이상", userCount: funnel.activated_users },
    {
      label: "재방문 회원",
      description: `참여 기회의 ${funnel.retained_rate_threshold}% 이상`,
      userCount: funnel.retained_users,
    },
    {
      label: "핵심 회원",
      description: `참여 기회의 ${funnel.core_rate_threshold}% 이상`,
      userCount: funnel.core_users,
    },
  ];
  //!SECTION 상태값 영역

  return (
    <AdminDashboardRetentionWrapper
      summary={
        <span className="text-yds-c1m text-primary-100">
          평균 참여율 {Number(funnel.avg_participation_rate).toFixed(1)}%
        </span>
      }
    >
      <div className={RETENTION_CHART_BOX_CLASS} data-testid="admin-dashboard-retention-chart">
        <AdminDashboardRetentionChart stages={stages} />
      </div>
    </AdminDashboardRetentionWrapper>
  );
};

export default AdminDashboardRetention;
