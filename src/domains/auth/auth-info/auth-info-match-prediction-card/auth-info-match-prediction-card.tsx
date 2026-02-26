/**
 * 작성자: KYD
 * 기능: 마이페이지 메인 카드 - 승부 예측
 */
import { CreditCard } from "lucide-react";

const AuthInfoMatchPredictionCard = () => {
  const handleClick = () => {
    alert("승부 예측 화면은 준비 중입니다.");
  };

  return (
    <div
      className="bg-background-tertiary text-yds-s2 text-primary-100 card-navy-50 col-span-2 row-span-3 flex h-full w-full cursor-pointer flex-col justify-between"
      onClick={handleClick}
    >
      <div className="flex flex-col gap-2">
        <h2 className="text-yds-s2 text-white">승부 예측</h2>
        <p className="text-yds-c1m text-primary-100">승부 예측 확인</p>
      </div>
      <div className="flex justify-end">
        <div className="bg-background-forth flex h-8 w-8 items-center justify-center rounded-full">
          <CreditCard size={24} className="text-primary-100" />
        </div>
      </div>
    </div>
  );
};

export default AuthInfoMatchPredictionCard;
