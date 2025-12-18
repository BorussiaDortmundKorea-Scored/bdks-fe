/**
 * 작성자: KYD
 * 기능:
 * 프로세스 설명: 프로세스 복잡시 노션링크 첨부권장
 */
import { useState } from "react";

import { Coffee, Menu } from "lucide-react";

import { useAuth } from "@auth/contexts/AuthContext";

import { LogoutButton } from "@shared/components/layout/header/buttons";

const MenuButton = () => {
  //SECTION HOOK호출 영역
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const { user } = useAuth();
  //!SECTION HOOK호출 영역

  //SECTION 메서드 영역
  const handleBlankNaverCafe = () => {
    window.open("https://cafe.naver.com/greendkxc9", "_blank");
  };

  console.log("user", user);
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
        <div className="bg-background-primary fixed inset-0 top-15 z-10 h-19 w-full px-5 text-white">
          <ul className="flex flex-col gap-4">
            <li className="flex cursor-pointer items-center gap-2" onClick={handleBlankNaverCafe}>
              <Coffee size={24} className="text-primary-100" /> 네이버 카페 바로가기
            </li>
            <li className="flex cursor-pointer items-center gap-2">
              <LogoutButton /> 로그아웃 하기
            </li>
          </ul>
        </div>
      )}
    </>
  );
};

export default MenuButton;
