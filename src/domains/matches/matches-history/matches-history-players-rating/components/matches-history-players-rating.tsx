/**
 * 작성자: KYD
 * 기능:
 * 프로세스 설명: 프로세스 복잡시 노션링크 첨부권장
 */
import React from "react";
import { useParams } from "react-router-dom";

import { useGetMatchesHistoryPlayersRatingSuspense } from "../api/react-query-api/use-get-matches-history-players-rating-suspense";
import MatchesHistoryPlayersRatingWrapper from "./wrapper/matches-history-players-rating-wrapper";
import { BicepsFlexed, Camera, Trophy } from "lucide-react";

interface IMatchesHistoryPlayersRating {}

const MatchesHistoryPlayersRating: React.FC<IMatchesHistoryPlayersRating> = () => {
  //SECTION HOOK호출 영역
  const { matchId } = useParams();
  const { data: matchesHistoryPlayersRating } = useGetMatchesHistoryPlayersRatingSuspense(matchId as string);

  //!SECTION HOOK호출 영역

  //SECTION 상태값 영역
  //!SECTION 상태값 영역

  //SECTION 메서드 영역

  //!SECTION 메서드 영역

  return (
    <MatchesHistoryPlayersRatingWrapper>
      <header className="flex items-center justify-between">
        <div className="flex flex-col gap-2">
          <h2 className="text-yds-s2 text-white">도르트문트 vs 레버쿠젠</h2>
          <p className="text-yds-c1m text-primary-100">2025.09.29 18:00</p>
        </div>
        <Camera size={24} className="text-primary-100 cursor-pointer" />
      </header>
      <div className="text-yds-s2 text-primary-100">선수단 평점</div>
      <ul>
        {matchesHistoryPlayersRating.map((item) => (
          <li
            key={item.korean_name}
            className="flex h-[72px] w-full items-center justify-between px-2 odd:bg-[#20242D]"
          >
            <div className="flex items-center gap-2">
              <img src={item.head_profile_image_url} alt={item.korean_name} className="h-[56px] w-[56px]" />
              <div className="flex flex-col gap-1">
                <div className="text-yds-b1 text-white">{item.korean_name}</div>
                <div className="text-yds-c1m text-primary-100">{item.position_detail_name}</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div>
                {item.botm ? (
                  <div className="flex items-center gap-1">
                    <BicepsFlexed size={16} className="text-primary-100" />{" "}
                    <span className="text-yds-c1m text-primary-100">BOTM</span>
                  </div>
                ) : (
                  ""
                )}
              </div>
              <div className="flex items-center gap-1">
                <Trophy size={16} className="text-primary-100" />
                <span className="text-yds-c1m text-primary-100">{item.avg_rating}</span>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </MatchesHistoryPlayersRatingWrapper>
  );
};

export default MatchesHistoryPlayersRating;
