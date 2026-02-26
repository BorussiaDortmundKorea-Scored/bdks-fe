/**
 * 작성자: KYD
 * 기능: 마이페이지 빠른 링크 섹션
 */
import { Calendar, CheckCircle, Users } from "lucide-react";

import AuthInfoQuickLinkButton from "../auth-info-quick-link-button/auth-info-quick-link-button";

const quickLinks = [
  {
    id: "match-schedule",
    IconComponent: Calendar,
    label: "경기",
    onClick: () => alert("경기 화면은 준비 중입니다."),
  },
  {
    id: "player-stats",
    IconComponent: Users,
    label: "선수",
    onClick: () => alert("선수 화면은 준비 중입니다."),
  },
  {
    id: "attendance-check",
    IconComponent: CheckCircle,
    label: "출석",
    onClick: () => alert("출석 화면은 준비 중입니다."),
  },
];

const AuthInfoQuickLinks = () => {
  return (
    <>
      <h2 className="text-yds-s2 text-primary-100">바로가기</h2>
      <div className="scrollbar-hide-x flex gap-3 overflow-x-scroll select-none">
        {quickLinks.map((link) => (
          <AuthInfoQuickLinkButton
            key={link.id}
            IconComponent={link.IconComponent}
            label={link.label}
            onClick={link.onClick}
          />
        ))}
      </div>
    </>
  );
};

export default AuthInfoQuickLinks;
