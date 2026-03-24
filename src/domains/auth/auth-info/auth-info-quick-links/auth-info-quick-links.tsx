/**
 * 작성자: KYD
 * 기능: 마이페이지 빠른 링크 섹션
 */
import { useNavigate } from "react-router-dom";

import AuthInfoQuickLinkButton from "../auth-info-quick-link-button/auth-info-quick-link-button";
import { useOverlay } from "@youngduck/yd-ui/Overlays";

import { useAuth } from "@auth/contexts/AuthContext";

import { ROUTES } from "@shared/constants/routes";
import { SUPABASE_STORAGE_URL } from "@shared/constants/supabse-storage";

const ICON_BASE = `${SUPABASE_STORAGE_URL}/asset/3d-icons`;

const AuthInfoQuickLinks = () => {
  //SECTION HOOK호출 영역
  const navigate = useNavigate();
  const { deleteAccount } = useAuth();
  const { toast, confirmDialog } = useOverlay();
  //!SECTION HOOK호출 영역

  //SECTION 메서드 영역
  const handleDeleteAccount = () => {
    confirmDialog({
      title: "회원탈퇴",
      description: "회원탈퇴시 모든 데이터가 삭제되어 복구할 수 없어요",
      confirmText: "탈퇴하기",
      cancelText: "취소",
      onConfirm: async () => {
        try {
          const result = await deleteAccount();
          if (result.success) {
            toast({ content: result.message || "회원탈퇴가 완료되었습니다." });
          } else {
            toast({ content: result.error || "회원탈퇴 중 오류가 발생했습니다." });
          }
        } catch {
          toast({ content: "회원탈퇴 중 오류가 발생했습니다." });
        }
      },
    });
  };
  //!SECTION 메서드 영역

  return (
    <>
      <h2 className="text-yds-s2 text-primary-100">바로가기</h2>
      <div className="scrollbar-hide-x flex gap-3 overflow-x-scroll select-none">
        <AuthInfoQuickLinkButton
          iconSrc={`${ICON_BASE}/viewing-check.png`}
          label="관람 체크"
          onClick={() => navigate(ROUTES.VIEWING_CHECK)}
        />
        <AuthInfoQuickLinkButton
          iconSrc={`${ICON_BASE}/dev-contact.png`}
          label="개발자 문의"
          onClick={() => navigate(ROUTES.DEV_CONTACT)}
        />
        <AuthInfoQuickLinkButton
          iconSrc={`${ICON_BASE}/delete-account.png`}
          label="회원 탈퇴"
          onClick={handleDeleteAccount}
        />
      </div>
    </>
  );
};

export default AuthInfoQuickLinks;
