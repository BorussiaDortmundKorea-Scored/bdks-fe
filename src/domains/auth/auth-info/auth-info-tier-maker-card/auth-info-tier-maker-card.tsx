/**
 * 작성자: KYD
 * 기능: 마이페이지 메인 카드 - 티어메이커
 */
import { Settings } from "lucide-react";

const AuthInfoTierMakerCard = () => {
  const handleClick = () => {
    alert("티어메이커 화면은 준비 중입니다.");
  };

  return (
    <div
      className="bg-background-tertiary text-yds-s2 text-primary-100 card-navy-50 col-span-3 row-span-3 flex h-full w-full cursor-pointer flex-col justify-between"
      onClick={handleClick}
    >
      <div className="flex flex-col gap-2">
        <h2 className="text-yds-s2 text-white">티어메이커</h2>
        <p className="text-yds-c1m text-primary-100">티어 관리 및 설정</p>
      </div>
      <div className="flex justify-end">
        <div className="bg-background-forth flex h-8 w-8 items-center justify-center rounded-full">
          <Settings size={24} className="text-primary-100" />
        </div>
      </div>
    </div>
  );
};

export default AuthInfoTierMakerCard;
