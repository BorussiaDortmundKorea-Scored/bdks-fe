/**
 * 작성자: KYD
 * 기능: 마이페이지 빠른 링크 버튼 컴포넌트
 */
import type { ReactNode } from "react";

interface AuthInfoQuickLinkButtonProps {
  icon: ReactNode;
  label: string;
  onClick?: () => void;
}

const AuthInfoQuickLinkButton = ({ icon, label, onClick }: AuthInfoQuickLinkButtonProps) => {
  return (
    <button
      className="bg-background-tertiary card-navy-50 flex h-20 w-20 shrink-0 cursor-pointer flex-col items-center justify-center gap-1 rounded-lg"
      onClick={onClick}
    >
      <div className="flex h-10 w-10 items-center justify-center">{icon}</div>
      <span className="text-yds-c1m whitespace-pre-line text-center text-white">{label}</span>
    </button>
  );
};

export default AuthInfoQuickLinkButton;
