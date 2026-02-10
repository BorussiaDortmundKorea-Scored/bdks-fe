/**
 * 작성자: KYD
 * 기능: 마이페이지 메인 카드 - 보유 포인트
 */

import { useGetProfilePointsSuspense } from "@auth/auth-info/auth-info-point-card/api/react-query-api/use-get-profile";
import { useAuth } from "@auth/contexts/AuthContext";

const AuthInfoPointCard = () => {
  const { user } = useAuth();
  const profilePoints = useGetProfilePointsSuspense(user!.id);

  const displayPoints = profilePoints ? profilePoints.points : 0;

  return (
    <div
      className="bg-background-tertiary text-yds-b2 text-primary-100 card-navy-50 col-span-2 row-span-4 flex h-full w-full flex-col justify-between"
      aria-label={`보유 포인트 ${displayPoints}점`}
    >
      <div className="flex flex-col gap-2">
        <h2 className="text-yds-s2 text-white">보유 포인트</h2>
      </div>
      <div className="flex justify-end">
        <p
          className="bg-background-forth flex h-8 w-auto items-center justify-center rounded-full px-2"
          data-testid="auth-info-point-card-points"
        >
          {displayPoints}p
        </p>
      </div>
    </div>
  );
};

export default AuthInfoPointCard;
