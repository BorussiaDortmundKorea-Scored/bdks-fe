/**
 * 작성자: KYD
 * 기능: 마이페이지 빠른 링크 버튼 컴포넌트
 */

interface AuthInfoQuickLinkButtonProps {
  iconSrc: string;
  label: string;
  onClick: () => void;
}

const AuthInfoQuickLinkButton = ({ iconSrc, label, onClick }: AuthInfoQuickLinkButtonProps) => {
  return (
    <button
      className="flex h-26 w-26 shrink-0 cursor-pointer flex-col items-center justify-center gap-1 rounded-lg"
      onClick={onClick}
    >
      <div className="bg-background-fourth flex h-18 w-18 justify-center rounded-full">
        <img src={iconSrc} alt={label} className="h-18 w-18" />
      </div>
      <span className="text-yds-b2 text-center whitespace-pre-line text-white">{label}</span>
    </button>
  );
};

export default AuthInfoQuickLinkButton;
