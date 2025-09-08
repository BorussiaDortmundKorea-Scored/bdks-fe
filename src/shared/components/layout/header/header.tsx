/**
 * 작성자: KYD
 * 기능:
 * 프로세스 설명: 프로세스 복잡시 노션링크 첨부권장
 */
import React from "react";

interface HeaderOptions {
  leftIcon: React.ReactNode;
}

interface IHeader {
  options: HeaderOptions;
}

const Header: React.FC<IHeader> = ({ options }) => {
  //SECTION HOOK호출 영역

  //!SECTION HOOK호출 영역

  //SECTION 상태값 영역

  //!SECTION 상태값 영역

  //SECTION 메서드 영역

  //!SECTION 메서드 영역

  return (
    <header className="w-full flex layout-header-height items-center relative">
      {options.leftIcon}
      <h1 className="text-primary-100 font-shilla-culture absolute left-1/2 -translate-x-1/2 text-2xl font-bold">
        보돌코 스코어드
      </h1>
    </header>
  );
};

export default Header;
