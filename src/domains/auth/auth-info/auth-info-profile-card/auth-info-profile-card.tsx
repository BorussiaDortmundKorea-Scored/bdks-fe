/**
 * 작성자: KYD
 * 기능: 마이페이지 메인 카드 - 프로필 정보
 */
import { User } from "lucide-react";

const AuthInfoProfileCard = () => {
  const handleClick = () => {
    alert("프로필 화면은 준비 중입니다.");
  };

  return (
    <div
      className="text-yds-s2 text-primary-100 card-navy-50 col-span-3 row-span-4 flex h-full w-full cursor-pointer flex-col justify-between"
      onClick={handleClick}
    >
      <div className="flex flex-col gap-2">
        <h2 className="text-yds-s2 text-white">프로필</h2>
        <p className="text-yds-c1m text-primary-100">내 정보 확인 및 수정</p>
      </div>
      <div className="flex justify-end">
        <div className="bg-background-forth flex h-8 w-8 items-center justify-center rounded-full">
          <User size={24} className="text-primary-100" />
        </div>
      </div>
    </div>
  );
};

export default AuthInfoProfileCard;
