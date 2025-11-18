/**
 * 작성자: KYD
 * 기능:
 * 프로세스 설명: 프로세스 복잡시 노션링크 첨부권장
 */
import React from "react";
import { useNavigate } from "react-router-dom";

import { Award, ChartNoAxesCombined, Trophy, Users, Volleyball } from "lucide-react";

import { ROUTES } from "@shared/constants/routes";

interface IAdminWrapper {
  children: React.ReactNode;
}
const adminMenus = [
  { id: "dashboard", label: "Dashboard", path: ROUTES.ADMIN_DASHBOARD, icon: ChartNoAxesCombined },
  { id: "player", label: "Players", path: ROUTES.ADMIN_PLAYER, icon: Users },
  { id: "match", label: "Matches", path: ROUTES.ADMIN_MATCH, icon: Volleyball },
  { id: "team", label: "Teams", path: ROUTES.ADMIN_TEAM, icon: Award },
  { id: "competition", label: "Leagues", path: ROUTES.ADMIN_COMPETITION, icon: Trophy },
  { id: "user", label: "Users", path: ROUTES.ADMIN_USER, icon: Users },
];

const AdminGridWrapper: React.FC<IAdminWrapper> = ({ children }) => {
  //SECTION HOOK호출 영역
  const navigate = useNavigate();

  //!SECTION HOOK호출 영역

  //SECTION 상태값 영역

  //!SECTION 상태값 영역

  //SECTION 메서드 영역
  const handleMenuClick = (path: string) => {
    navigate(path);
  };
  //!SECTION 메서드 영역

  return (
    <main className="bdks-admin-container">
      <div className="grid w-full [grid-template-columns:200px_minmax(0,1fr)] gap-4">
        <nav className="bg-background-secondary card-navy-50 relative flex min-h-[876px] flex-col gap-4 rounded-lg p-4">
          <h1
            className="font-shilla-culture text-primary-100 text-center text-[24px] font-semibold"
            onClick={() => navigate(ROUTES.ADMIN_DASHBOARD)}
          >
            보돌코 <br /> 스코어드
          </h1>
          <div className="text-yds-s2 text-white">MENU</div>
          <ul className="flex w-full flex-col gap-4">
            {adminMenus.map((menu) => (
              <li
                key={menu.id}
                onClick={() => handleMenuClick(menu.path)}
                className="text-yds-s2 hover:border-primary-100 flex w-full cursor-pointer items-center gap-2 text-white hover:border-r-2"
              >
                <menu.icon size={24} className="text-primary-100" />
                {menu.label}
              </li>
            ))}
          </ul>
        </nav>
        <div className="bg-background-secondary card-navy-50 rounded-lg p-4 text-white">
          <div className="grid h-full w-full grid-cols-8 grid-rows-8 gap-4">{children}</div>
        </div>
      </div>
    </main>
  );
};

export default AdminGridWrapper;
