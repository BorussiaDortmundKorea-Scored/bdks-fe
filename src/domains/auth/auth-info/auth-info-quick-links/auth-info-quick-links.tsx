/**
 * 작성자: KYD
 * 기능: 마이페이지 빠른 링크 섹션
 */
import AuthInfoQuickLinkButton from "../auth-info-quick-link-button/auth-info-quick-link-button";
import { Calendar, CheckCircle, Users } from "lucide-react";

const AuthInfoQuickLinks = () => {
  const quickLinks = [
    {
      id: "match-schedule",
      icon: (
        <div className="bg-background-forth relative flex h-8 w-8 items-center justify-center rounded-full">
          <Calendar size={20} className="text-primary-100" />
        </div>
      ),
      label: "경기",
      onClick: () => alert("경기 화면은 준비 중입니다."),
    },
    {
      id: "player-stats",
      icon: (
        <div className="bg-background-forth relative flex h-8 w-8 items-center justify-center rounded-full">
          <Users size={20} className="text-primary-100" />
        </div>
      ),
      label: "선수",
      onClick: () => alert("선수 화면은 준비 중입니다."),
    },
    {
      id: "attendance-check",
      icon: (
        <div className="bg-background-forth relative flex h-8 w-8 items-center justify-center rounded-full">
          <CheckCircle size={20} className="text-primary-100" />
        </div>
      ),
      label: "출석",
      onClick: () => alert("출석 화면은 준비 중입니다."),
    }
  ];

  return (
    <>
      <h2 className="text-yds-s2 text-primary-100">원클릭 바로가기</h2>
      <div className="scrollbar-hide-x flex gap-3 overflow-x-scroll select-none">
        {quickLinks.map((link) => (
          <AuthInfoQuickLinkButton key={link.id} icon={link.icon} label={link.label} onClick={link.onClick} />
        ))}
      </div>
    </>
  );
};

export default AuthInfoQuickLinks;
