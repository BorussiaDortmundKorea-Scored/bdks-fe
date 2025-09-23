/**
 * 작성자: KYD
 * 기능: 관리자 페이지 - 각 관리 메뉴로 이동
 * 프로세스 설명: 관리 메뉴 항목들을 배열로 관리하고 클릭 시 해당 페이지로 이동
 */
import { useNavigate } from "react-router-dom";

import { Award, ChartNoAxesCombined, Trophy, Users, Volleyball } from "lucide-react";

import AdminWrapper from "@admin/provider/admin-wrapper";

//SECTION 리렌더링이 불필요한영역: 매직넘버, 문자열, 상수
const adminMenus = [
  { id: "dashboard", label: "Dashboard", path: "/admin", icon: ChartNoAxesCombined },
  { id: "player", label: "Players", path: "/admin/player", icon: Users },
  { id: "match", label: "Matches", path: "/admin/match", icon: Volleyball },
  { id: "team", label: "Teams", path: "/admin/team", icon: Award },
  { id: "competition", label: "Leagues", path: "/admin/competition", icon: Trophy },
];
//SECTION 리렌더링이 불필요한영역: 매직넘버, 문자열, 상수

const AdminPage = () => {
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
    <AdminWrapper>
      <div className="grid w-full [grid-template-columns:200px_minmax(0,1fr)] gap-4">
        <nav className="bg-background-secondary border-navy-50 relative flex min-h-[876px] flex-col gap-4 rounded-lg p-4">
          <h1 className="text-yds-s1 font-shilla-culture text-primary-100 text-center">
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

        <div className="bg-background-secondary rounded-lg p-4">
          <div className="grid h-full w-full grid-cols-4 grid-rows-4 gap-4">
            <div>1</div>
            <div>1</div>
            <div>1</div>
            <div>1</div>
            <div>1</div>
            <div>1</div>
            <div>1</div>
          </div>
        </div>
      </div>
    </AdminWrapper>
  );
};

export default AdminPage;
