/**
 * 작성자: KYD
 * 기능: 관리자 페이지 - 각 관리 메뉴로 이동
 * 프로세스 설명: 관리 메뉴 항목들을 배열로 관리하고 클릭 시 해당 페이지로 이동
 */
import AdminGridWrapper from "@admin/provider/admin-grid-wrapper";

const AdminDashboardPage = () => {
  return (
    <AdminGridWrapper>
      <div className="border-navy-50 col-start-1 col-end-9 row-start-1 row-end-2 h-full w-full rounded-lg p-4">1</div>
      <div className="bg-background-tertiary text-yds-s1 border-navy-50 col-start-1 col-end-3 row-start-2 row-end-4 h-full w-full rounded-lg p-4">
        회원 수
      </div>
      <div>1</div>
      <div>1</div>
      <div>1</div>
      <div>1</div>
      <div>1</div>
    </AdminGridWrapper>
  );
};

export default AdminDashboardPage;
