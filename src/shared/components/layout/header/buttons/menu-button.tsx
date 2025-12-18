/**
 * 작성자: KYD
 * 기능:
 * 프로세스 설명: 프로세스 복잡시 노션링크 첨부권장
 */
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { Coffee, Menu, Settings } from "lucide-react";

import { useAuth } from "@auth/contexts/AuthContext";

import { LogoutButton } from "@shared/components/layout/header/buttons";
import { ROUTES } from "@shared/constants/routes";

const MenuButton = () => {
  //SECTION HOOK호출 영역
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const { profile } = useAuth();
  const navigate = useNavigate();
  const isAdmin = Boolean(profile?.is_admin);
  //!SECTION HOOK호출 영역

  //SECTION 메서드 영역
  const handleBlankNaverCafe = () => {
    window.open(ROUTES.NAVER_CAFE, "_blank");
  };

  const handleGoAdminDashboard = () => {
    navigate(ROUTES.ADMIN_DASHBOARD);
    setIsMenuOpen(false);
  };
  //!SECTION 메서드 영역

  return (
    <>
      <Menu
        size={24}
        className="text-primary-100 cursor-pointer"
        aria-label="메뉴"
        onClick={() => setIsMenuOpen(!isMenuOpen)}
      />
      {isMenuOpen && (
        <div className="bg-background-primary fixed top-15 right-0 left-0 z-10 h-auto w-full px-5 py-5 text-white">
          <ul className="flex flex-col gap-4">
            <li className="flex cursor-pointer items-center gap-2" onClick={handleBlankNaverCafe}>
              <Coffee size={24} className="text-primary-100" /> 네이버 카페 바로가기
            </li>
            <li className="flex cursor-pointer items-center gap-2">
              <LogoutButton /> 로그아웃 하기
            </li>
            {isAdmin && (
              <li className="flex cursor-pointer items-center gap-2" onClick={handleGoAdminDashboard}>
                <Settings size={24} className="text-primary-100" />
                관리자 페이지 이동하기
              </li>
            )}
          </ul>
        </div>
      )}
    </>
  );
};

export default MenuButton;
