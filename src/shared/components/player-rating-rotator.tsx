/**
 * 작성자: KYD
 * 기능: 라이브경기 존재시에는 라이브평점, 라이브경기 없을시 최근 경기 평점
 * 프로세스 설명: TODO 쿼리래퍼로 선언적API호출,
 */
import React from "react";

interface IPlayerRatingRotator {}

const PlayerRatingRotator: React.FC<IPlayerRatingRotator> = () => {
  //SECTION HOOK호출 영역
  const rawData = [
    {
      name: "그레고르 코벨",
      rating: 7.9,
    },
    {
      name: "세루 기라시",
      rating: 8.4,
    },
    {
      name: "니코 슐로터벡",
      rating: 7.2,
    },
    {
      name: "율리안 브란트",
      rating: 7.2,
    },
  ];
  //!SECTION HOOK호출 영역

  //SECTION 상태값 영역

  //!SECTION 상태값 영역

  //SECTION 메서드 영역

  //!SECTION 메서드 영역

  return (
    <div className="flex w-full gap-3 overflow-x-hidden text-xl text-white">
      {rawData.map((item) => (
        <div key={item.name} className="flex shrink-0 gap-1">
          {item.name}
          <span className={item.rating < 8 ? "text-rating-blue" : "text-rating-red"}>{item.rating}</span>
        </div>
      ))}
    </div>
  );
};

export default PlayerRatingRotator;
