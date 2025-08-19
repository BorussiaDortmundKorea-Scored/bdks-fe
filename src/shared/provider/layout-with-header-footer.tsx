import React from "react";

interface ILayoutWithHeaderFooter {
  children: React.ReactNode;
  className?: string;
}

/**
 * Header와 Footer가 있는 레이아웃 Provider
 * - Header 고정 (상단)
 * - Footer 고정 (하단)
 * - 내부 컨텐츠 영역 스크롤 가능 (가운데)
 * - 높이: 100dvh - Header 높이 (60px) - Footer 높이 (48px)
 */
const LayoutWithHeaderFooter: React.FC<ILayoutWithHeaderFooter> = ({ children, className = "" }) => {
  return (
    <div
      className={`w-full layout-content-with-header-footer flex flex-col gap-4 overflow-y-auto scrollbar-hide ${className}`}
    >
      {children}
    </div>
  );
};

export default LayoutWithHeaderFooter;
