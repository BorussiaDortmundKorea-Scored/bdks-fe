import React from "react";

interface ILayoutWithHeader {
  children: React.ReactNode;
  className?: string;
}

/**
 * Header만 있는 레이아웃 Provider
 * - Header 고정
 * - 내부 컨텐츠 영역 스크롤 가능
 * - 높이: 100dvh - Header 높이 (60px)
 */
const LayoutWithHeader: React.FC<ILayoutWithHeader> = ({ children, className = "" }) => {
  return (
    <div
      className={`w-full layout-content-with-header flex flex-col gap-4 overflow-y-auto scrollbar-hide ${className}`}
    >
      {children}
    </div>
  );
};

export default LayoutWithHeader;
