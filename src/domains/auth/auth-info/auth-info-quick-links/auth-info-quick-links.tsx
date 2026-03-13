/**
 * 작성자: KYD
 * 기능: 마이페이지 빠른 링크 섹션
 */
import { useNavigate } from "react-router-dom";

import { CheckCircle, Mail } from "lucide-react";

import AuthInfoQuickLinkButton from "../auth-info-quick-link-button/auth-info-quick-link-button";
import { ROUTES } from "@shared/constants/routes";

const quickLinks = [
  {
    id: "viewing-check",
    IconComponent: CheckCircle,
    label: "관람",
    path: ROUTES.VIEWING_CHECK,
  },
  {
    id: "dev-contact",
    IconComponent: Mail,
    label: "문의",
    path: ROUTES.DEV_CONTACT,
  },
];

const AuthInfoQuickLinks = () => {
  const navigate = useNavigate();

  return (
    <>
      <h2 className="text-yds-s2 text-primary-100">바로가기</h2>
      <div className="scrollbar-hide-x flex gap-3 overflow-x-scroll select-none">
        {quickLinks.map((link) => (
          <AuthInfoQuickLinkButton
            key={link.id}
            IconComponent={link.IconComponent}
            label={link.label}
            onClick={() => navigate(link.path)}
          />
        ))}
      </div>
    </>
  );
};

export default AuthInfoQuickLinks;
