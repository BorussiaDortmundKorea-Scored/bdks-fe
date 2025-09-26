/**
 * 작성자: KYD
 * 기능:
 * 프로세스 설명: 프로세스 복잡시 노션링크 첨부권장
 */
import React from "react";

import { SITE_LINK_DATA } from "../constants/site-link-data";
import AdminDashboardSitesWrapper from "./wrapper/admin-dashboard-sites-wrapper";

interface IAdminDashboardSites {}

const AdminDashboardSites: React.FC<IAdminDashboardSites> = () => {
  //SECTION HOOK호출 영역

  //!SECTION HOOK호출 영역

  //SECTION 상태값 영역

  //!SECTION 상태값 영역

  //SECTION 메서드 영역

  //!SECTION 메서드 영역

  return (
    <AdminDashboardSitesWrapper>
      {SITE_LINK_DATA.map((item) => (
        <div className="cursor-pointer" key={item.id} onClick={() => window.open(item.link, "_blank")}>
          {item.name}
        </div>
      ))}
    </AdminDashboardSitesWrapper>
  );
};

export default AdminDashboardSites;
