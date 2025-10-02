/**
 * 작성자: KYD
 * 기능: 경기 선수 평점 리스트 아이템 컴포넌트
 */
import { BicepsFlexed, Trophy } from "lucide-react";

import { type IMatchesHistoryPlayersRating } from "@matches/matches-history/matches-history-players-rating/api/matches-history-players-rating-api";

import { SUPABASE_STORAGE_URL } from "@shared/constants/supabse-storage";

interface MatchesHistoryPlayersRatingItemProps {
  player: IMatchesHistoryPlayersRating;
}

// const RED_CARD_IMAGE = `${SUPABASE_STORAGE_URL}/asset/red-card.png`;
const YELLOW_CARD_IMAGE = `${SUPABASE_STORAGE_URL}/asset/yellow-card.png`;
const GOAL_IMAGE = `${SUPABASE_STORAGE_URL}/asset/goal.png`;
const EXCHANGE_IN_IMAGE = `${SUPABASE_STORAGE_URL}/asset/exchange-in.png`;
const EXCHANGE_OUT_IMAGE = `${SUPABASE_STORAGE_URL}/asset/exchange-out.png`;
// const YELLOW_RED_CARD_IMAGE = `${SUPABASE_STORAGE_URL}/asset/yellow-red-card.png`;

const MatchesHistoryPlayersRatingItem = ({ player }: MatchesHistoryPlayersRatingItemProps) => {
  // 복잡한 조건에 이름 붙이기
  const hasGoals = player.goals > 0;
  const hasYellowCards = player.yellow_cards > 0;

  return (
    <li className="flex h-[72px] w-full items-center justify-between gap-4 px-2 odd:bg-[#20242D]">
      {/* 왼쪽: 선수 정보 (flex-1로 유연하게, 겹침 방지) */}
      <div className="flex min-w-0 flex-1 items-center gap-2">
        <img src={player.head_profile_image_url} alt={player.korean_name} className="h-[56px] w-[56px] flex-shrink-0" />
        <div className="flex min-w-0 flex-1 flex-col gap-1">
          <div className="text-yds-b1 truncate text-white">{player.korean_name}</div>
          <div className="flex flex-wrap items-center gap-1">
            <span className="text-yds-c1m text-primary-100">{player.position_detail_name}</span>
            {hasGoals ? (
              <div className="flex items-center gap-0.5">
                {Array.from({ length: player.goals }).map((_, idx) => (
                  <img key={`goal-${idx}-${player.korean_name}`} src={GOAL_IMAGE} alt="goal" className="h-4 w-4" />
                ))}
              </div>
            ) : null}
            {hasYellowCards ? (
              <div className="flex items-center gap-0.5">
                {Array.from({ length: player.yellow_cards }).map((_, idx) => (
                  <img key={`yc-${idx}`} src={YELLOW_CARD_IMAGE} alt="yellow card" className="h-3 w-3" />
                ))}
              </div>
            ) : null}
            {player.substitution_status === "SUBSTITUTED_IN" ? (
              <div className="flex items-center gap-0.5">
                <img src={EXCHANGE_IN_IMAGE} alt="substituted in" className="h-6 w-6" />
                {player.substitution_minute !== null ? (
                  <span className="text-yds-c2m text-primary-100">{player.substitution_minute}'</span>
                ) : null}
              </div>
            ) : player.substitution_status === "SUBSTITUTED_OUT" ? (
              <div className="flex items-center gap-0.5">
                <img src={EXCHANGE_OUT_IMAGE} alt="substituted out" className="h-6 w-6" />
                {player.substitution_minute !== null ? (
                  <span className="text-yds-c2m text-primary-100">{player.substitution_minute}'</span>
                ) : null}
              </div>
            ) : null}
          </div>
        </div>
      </div>

      {/* 오른쪽: 평점 및 BOTM (겹침 방지, 고정 폭) */}
      <div className="flex flex-shrink-0 items-center gap-2">
        {player.botm ? (
          <div className="flex items-center gap-1">
            <BicepsFlexed size={16} className="text-primary-100" />
            <span className="text-yds-c1m text-primary-100">BOTM</span>
          </div>
        ) : null}
        <div className="flex items-center gap-1">
          <Trophy size={16} className="text-primary-100" />
          <span className="text-yds-c1m text-primary-100">{player.avg_rating}</span>
        </div>
      </div>
    </li>
  );
};

export default MatchesHistoryPlayersRatingItem;
