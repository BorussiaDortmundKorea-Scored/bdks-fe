/**
 * 작성자: KYD
 * 기능: 헤더 메뉴 버튼 컴포넌트
 * 프로세스 설명: 메뉴 버튼 클릭 시 네비게이션 메뉴 표시
 */
import { useState } from "react";

import { Menu } from "lucide-react";

import { useNavigationItems } from "@shared/hooks/use-navigation-items";

const MenuButton = () => {
  //SECTION HOOK호출 영역
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const { items } = useNavigationItems("top-menu");
  //!SECTION HOOK호출 영역

  //SECTION 메서드 영역
  const handleItemClick = (onClick: () => void) => {
    onClick();
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
            {items.map((item) => {
              const Icon = item.icon;
              return (
                <li
                  key={item.id}
                  className="flex cursor-pointer items-center gap-2"
                  onClick={() => handleItemClick(item.onClick)}
                >
                  <Icon size={24} className="text-primary-100" /> {item.label}
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </>
  );
};

export default MenuButton;
