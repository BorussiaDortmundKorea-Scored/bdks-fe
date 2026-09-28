/**
 * 작성자: KYD
 * 기능: 포메이션 선수 카드 (최신경기 · 경기 평점 공용)
 * 프로세스 설명: 원형 아바타 + 우하단 평점 배지가 기본이고, 나머지 세 모서리 배지는
 *              값이 넘어온 화면에서만 나타난다. 두 화면이 같은 코드를 쓰고 정보량만 달라진다.
 *
 *              카드에 이름은 쓰지 않는다. 누구인지는 얼굴로 알아보고, 전체 이름은 img 의 alt 와
 *              링크의 aria-label 에만 남긴다.
 */
import { Link } from "react-router-dom";

import { Crown } from "lucide-react";

import { type IFormationPlayer } from "@shared/components/match/formation/formation-types";
import { SUPABASE_STORAGE_URL } from "@shared/constants/supabse-storage";

const YELLOW_CARD_IMAGE = `${SUPABASE_STORAGE_URL}/asset/yellow-card.png`;
const RED_CARD_IMAGE = `${SUPABASE_STORAGE_URL}/asset/red-card.png`;
const GOAL_IMAGE = `${SUPABASE_STORAGE_URL}/asset/goal.png`;
const EXCHANGE_IN_IMAGE = `${SUPABASE_STORAGE_URL}/asset/exchange-in.png`;
const EXCHANGE_OUT_IMAGE = `${SUPABASE_STORAGE_URL}/asset/exchange-out.png`;

/** 카드 폭 — 한 줄 4명이 320px 에서도 안 넘치는 값 */
const CARD_WIDTH_CLASS = "xs:w-[60px] w-[52px] sm:w-[68px] md:w-[78px]";
/** 아바타 크기 (최신경기 PlayerCard 와 같은 단계) */
const AVATAR_CLASS =
  "xs:h-[52px] xs:w-[52px] relative h-[46px] w-[46px] sm:h-[60px] sm:w-[60px] md:h-[66px] md:w-[66px]";
/** 옐로우 월 군중 위에서도 글자가 읽히도록 */
const TEXT_SHADOW_CLASS = "[text-shadow:0_1px_3px_rgba(0,0,0,0.95)]";

interface IFormationPlayerCardProps {
  player: IFormationPlayer;
  /** 지정하면 카드 전체가 링크가 된다 */
  to?: string;
  /** 링크를 눌러도 이동하지 않아야 할 때의 안내 문구 */
  disabledReason?: string;
  onDisabledClick?: (reason: string) => void;
}

const FormationPlayerCard = ({ player, to, disabledReason, onDisabledClick }: IFormationPlayerCardProps) => {
  //SECTION 상태값 영역
  const goals = player.goals ?? 0;
  const isSentOff = player.isSentOff === true;
  const isSubstitutedIn = player.subInMinute != null;
  const isSubstitutedOut = player.subOutMinute != null;

  // 퇴장한 선수는 경고를 다 늘어놓지 않고 "옐로 → 레드" 한 쌍으로만 보여준다.
  // 경고누적 퇴장이라는 걸 그대로 읽히면서 배지가 평점 배지까지 밀고 들어가지 않는다.
  const shownYellowCards = isSentOff ? Math.min(player.yellowCards ?? 0, 1) : (player.yellowCards ?? 0);
  const hasCardBadge = shownYellowCards > 0 || isSentOff;

  // ratingCount 를 넘긴 화면에서만 미평가('-')를 구분한다. 안 넘기면 숫자를 그대로 보여준다.
  const ratingLabel = player.ratingCount === 0 ? "-" : player.rating;
  //!SECTION 상태값 영역

  //SECTION 메서드 영역
  const handleClick = (event: React.MouseEvent) => {
    if (!disabledReason) return;
    event.preventDefault();
    onDisabledClick?.(disabledReason);
  };
  //!SECTION 메서드 영역

  const body = (
    <>
      <div className={AVATAR_CLASS}>
        {/* 선수 이미지 컨테이너 */}
        <div className="border-primary-400 relative h-full w-full overflow-hidden rounded-full border-2 shadow-lg">
          <img src={player.imageUrl} alt={player.name} className="h-full w-full object-cover" />
          {/* 그림자 오버레이 */}
          <div className="absolute inset-0 bg-linear-to-b from-transparent via-transparent to-black/80" />
        </div>

        {/* 우하단: 평점 */}
        <div className="border-primary-400 absolute -right-1 -bottom-1 flex h-7 w-7 items-center justify-center rounded-full border-2 bg-black shadow-lg">
          <span className="text-yds-c1r font-bold text-white transition-all duration-300 ease-out">{ratingLabel}</span>
        </div>

        {/* 좌상단: BOTM / 주장 */}
        {player.isBestOfTheMatch ? (
          <div
            className="border-primary-400 absolute -top-1 -left-1 flex h-5 w-5 items-center justify-center rounded-full border bg-black"
            title="이 경기 최고 평점"
          >
            <Crown size={11} className="text-primary-100" />
          </div>
        ) : player.isCaptain ? (
          <div
            className="border-primary-400 absolute -top-1 -left-1 flex h-5 w-5 items-center justify-center rounded-full border bg-black"
            title="주장"
          >
            <span className="text-primary-100 text-[9px] font-bold">C</span>
          </div>
        ) : null}

        {/* 우상단: 골 — 넣은 만큼 그대로 */}
        {goals > 0 ? (
          <div className="absolute -top-1 -right-1 flex items-center gap-[1px] rounded-full bg-black/80 px-1 py-[1px]">
            {Array.from({ length: goals }).map((_, index) => (
              <img key={index} src={GOAL_IMAGE} alt="" className="h-3 w-3" />
            ))}
            <span className="sr-only">{goals}골</span>
          </div>
        ) : null}

        {/* 좌하단: 경고 → 퇴장 순 */}
        {hasCardBadge ? (
          <div className="absolute -bottom-1 -left-1 flex items-center gap-[1px] rounded-full bg-black/80 px-1 py-[1px]">
            {Array.from({ length: shownYellowCards }).map((_, index) => (
              <img key={index} src={YELLOW_CARD_IMAGE} alt="" className="h-3 w-3" />
            ))}
            {isSentOff ? <img src={RED_CARD_IMAGE} alt="" className="h-3 w-3" /> : null}
            <span className="sr-only">
              {isSentOff ? (shownYellowCards > 0 ? "경고 누적 퇴장" : "퇴장") : `경고 ${shownYellowCards}장`}
            </span>
          </div>
        ) : null}
      </div>

      {isSubstitutedIn || isSubstitutedOut ? (
        <div className="flex w-full items-center justify-center gap-[2px]">
          {isSubstitutedIn ? (
            <span className="flex items-center" title={`${player.subInMinute}분 교체 투입`}>
              <img src={EXCHANGE_IN_IMAGE} alt="" className="h-3 w-3" />
              <span className={`text-primary-100 text-[10px] ${TEXT_SHADOW_CLASS}`}>{player.subInMinute}'</span>
            </span>
          ) : null}
          {isSubstitutedOut ? (
            <span className="flex items-center" title={`${player.subOutMinute}분 교체 아웃`}>
              <img src={EXCHANGE_OUT_IMAGE} alt="" className="h-3 w-3" />
              <span className={`text-primary-100 text-[10px] ${TEXT_SHADOW_CLASS}`}>{player.subOutMinute}'</span>
            </span>
          ) : null}
        </div>
      ) : null}
    </>
  );

  const containerClass = `flex shrink-0 flex-col items-center gap-1 ${CARD_WIDTH_CLASS}`;

  if (!to) {
    return (
      <div className={containerClass} title={player.name}>
        {body}
      </div>
    );
  }

  return (
    <Link
      to={to}
      className={`${containerClass} cursor-pointer`}
      onClick={handleClick}
      aria-disabled={Boolean(disabledReason)}
      aria-label={`${player.name} 평점 입력`}
      title={player.name}
    >
      {body}
    </Link>
  );
};

export default FormationPlayerCard;
