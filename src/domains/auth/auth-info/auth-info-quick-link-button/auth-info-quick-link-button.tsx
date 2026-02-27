/**
 * 작성자: KYD
 * 기능: 마이페이지 빠른 링크 버튼 컴포넌트
 */
import type { LucideIcon } from "lucide-react";

const QUICK_LINK_ICON_SIZE = 20;
const QUICK_LINK_ICON_WRAPPER_CLASS =
  "bg-background-forth relative flex h-8 w-8 items-center justify-center rounded-full";

interface AuthInfoQuickLinkButtonProps {
  IconComponent: LucideIcon;
  label: string;
  onClick?: () => void;
}

const AuthInfoQuickLinkButton = ({ IconComponent, label, onClick }: AuthInfoQuickLinkButtonProps) => {
  return (
    <button
      className="bg-background-tertiary card-navy-50 flex h-20 w-20 shrink-0 cursor-pointer flex-col items-center justify-center gap-1 rounded-lg"
      onClick={onClick}
    >
      <div className="flex h-10 w-10 items-center justify-center">
        <div className={QUICK_LINK_ICON_WRAPPER_CLASS}>
          <IconComponent size={QUICK_LINK_ICON_SIZE} className="text-primary-100" />
        </div>
      </div>
      <span className="text-yds-c1m whitespace-pre-line text-center text-white">{label}</span>
    </button>
  );
};

export default AuthInfoQuickLinkButton;

