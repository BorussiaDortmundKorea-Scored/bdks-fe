/**
 * 작성자: KYD
 * 기능:
 * 프로세스 설명: 프로세스 복잡시 노션링크 첨부권장
 */
import { SITE_LINK_DATA } from "../constants/site-link-data";
import AdminDashboardSitesWrapper from "./wrapper/admin-dashboard-sites-wrapper";

const AdminDashboardSites = () => {
  //SECTION HOOK호출 영역

  //!SECTION HOOK호출 영역

  //SECTION 상태값 영역

  //!SECTION 상태값 영역

  //SECTION 메서드 영역

  //!SECTION 메서드 영역

  return (
    <AdminDashboardSitesWrapper>
      {SITE_LINK_DATA.map((item) => (
        <div
          className="cursor-pointer sm:h-6 sm:w-6 md:h-9 md:w-9"
          key={item.id}
          onClick={() => window.open(item.link, "_blank")}
        >
          <img src={item.logo} alt={item.name} className="h-full w-full" />
        </div>
      ))}
    </AdminDashboardSitesWrapper>
  );
};

export default AdminDashboardSites;
