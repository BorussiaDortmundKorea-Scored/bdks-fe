/**
 * 작성자: KYD
 * 기능: 관리자 페이지 - 각 관리 메뉴로 이동
 * 프로세스 설명: 관리 메뉴 항목들을 배열로 관리하고 클릭 시 해당 페이지로 이동
 */
import { useNavigate } from "react-router-dom";

import AdminWrapper from "@admin/provider/admin-wrapper";

//SECTION 리렌더링이 불필요한영역: 매직넘버, 문자열, 상수
const adminMenus = [
  { id: "player", label: "선수단 관리", path: "/admin/player" },
  { id: "match", label: "경기 관리", path: "/admin/match" },
  { id: "team", label: "상대팀 관리", path: "/admin/team" },
  { id: "competition", label: "대회 관리", path: "/admin/competition" },
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
      <header className="w-full flex layout-header-height items-center relative">
        <h1 className="text-primary-400 font-shilla-culture absolute left-1/2 -translate-x-1/2 text-2xl font-bold">
          관리자 페이지
        </h1>
      </header>
      <ul className="flex flex-col w-full">
        {adminMenus.map((menu) => (
          <li
            key={menu.id}
            onClick={() => handleMenuClick(menu.path)}
            className="p-4 w-full text-white bg-background-secondary even:bg-background-primary cursor-pointer"
          >
            {menu.label}
          </li>
        ))}
      </ul>
    </AdminWrapper>
  );
};

export default AdminPage;
