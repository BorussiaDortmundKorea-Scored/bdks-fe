/**
 * 작성자: KYD
 * 기능: 마이페이지 프로필 섹션 - 프로필 이미지, 닉네임, 보유 포인트 표시
 */
import { useNavigate } from "react-router-dom";

import { useGetProfileSummarySuspense } from "@auth/auth-info/auth-info-profile-card/api/react-query-api/use-get-profile";
import { useAuth } from "@auth/contexts/AuthContext";

import { ROUTES } from "@shared/constants/routes";
import { SUPABASE_STORAGE_URL } from "@shared/constants/supabse-storage";

const DEFAULT_PROFILE_IMAGE = `${SUPABASE_STORAGE_URL}/players/head/head_brandt.png`;

const AuthInfoProfileCard = () => {
  //SECTION HOOK호출 영역
  const navigate = useNavigate();
  const { user, profile } = useAuth();
  const profileSummary = useGetProfileSummarySuspense(user!.id);
  //!SECTION HOOK호출 영역

  //SECTION 상태값 영역
  const userName = profile?.nickname || user?.email?.split("@")[0] || "회원";
  const displayPoints = profileSummary ? profileSummary.points : 0;
  const profileImage = profileSummary?.favorite_player_image_url ?? DEFAULT_PROFILE_IMAGE;
  //!SECTION 상태값 영역

  return (
    <div className="flex w-full flex-col items-center gap-3">
      <div className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-full ring-2 ring-[var(--color-secondary-50)]">
        <img src={profileImage} alt="좋아하는 선수" className="h-20 w-20 object-cover" />
      </div>
      <div className="flex flex-col items-center gap-1">
        <h2 className="text-yds-s1 text-white">{userName}</h2>
        <div className="flex items-center gap-2">
          <p
            className="text-yds-c1m bg-background-fourth text-primary-100 rounded-full px-3 py-1"
            data-testid="auth-info-profile-card-points"
          >
            보유 포인트 {displayPoints}p
          </p>
          <button
            className="text-yds-c1m cursor-pointer rounded-full bg-(--color-primary-400) px-3 py-1 text-(--color-secondary-400)"
            onClick={() => navigate(ROUTES.EDIT_PROFILE)}
          >
            프로필 수정
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuthInfoProfileCard;
