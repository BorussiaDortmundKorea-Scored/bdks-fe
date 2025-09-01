/**
 * 작성자: KYD
 * 기능: 실시간 평점 화면. 몇명입력했는지, 평균 평점 실시간변동
 * 프로세스 설명: 프로세스 복잡시 노션링크 첨부권장
 */
import { useParams } from "react-router-dom";

import { Button } from "@youngduck/yd-ui";

import LayoutWithHeaderFooter from "@shared/provider/layout-with-header-footer";

import { useGetMatchPlayerRating } from "@matches/matches-lastest/matches-lastest-player-rating/api/react-query-api/use-get-match-player-rating";

const MatchesLastestPlayerRating = () => {
  //SECTION HOOK호출 영역
  const { matchId, playerId } = useParams();
  const { data: playerRating } = useGetMatchPlayerRating({
    matchId: matchId!,
    playerId: playerId!,
  });
  //!SECTION HOOK호출 영역

  //SECTION 상태값 영역

  //!SECTION 상태값 영역

  //SECTION 메서드 영역

  //!SECTION 메서드 영역

  return (
    <>
      <LayoutWithHeaderFooter>
        <div className="w-full h-auto">
          <div className="flex flex-col gap-2">
            {/* 선수 정보 */}
            <div className="flex items-center gap-4 p-4 bg-background-secondary rounded-lg">
              <img
                src={playerRating?.head_profile_image_url}
                alt={playerRating?.korean_name}
                className="w-16 h-16 rounded-full object-cover"
              />
              <div className="flex flex-col">
                <h2 className="text-xl font-bold text-white">{playerRating?.korean_name}</h2>
                <p className="text-primary-100">{playerRating?.position_detail_name}</p>
              </div>
            </div>

            {/* 평점 정보 */}
            <div className="flex justify-between items-center p-4 bg-background-secondary rounded-lg">
              <div className="flex flex-col gap-1">
                <p className="text-sm text-gray-400">실시간 평점</p>
                <p className="text-2xl font-bold text-primary-400">{playerRating?.avg_rating}</p>
              </div>
              <div className="flex flex-col gap-1">
                <p className="text-sm text-gray-400">평가한 보루센</p>
                <p className="text-lg font-semibold text-primary-100">{playerRating?.rating_count}명</p>
              </div>
            </div>

            {/* 평점 입력 */}
            <div className="flex justify-between items-center p-4 bg-background-secondary rounded-lg">
              {/* TODO: 평점 입력 폼 추가 */}
              평점 입력 폼
            </div>
          </div>
        </div>
      </LayoutWithHeaderFooter>
      <div className="w-full h-auto flex justify-center items-center p-4">
        <Button size="full">평점 입력</Button>
      </div>
    </>
  );
};

export default MatchesLastestPlayerRating;
