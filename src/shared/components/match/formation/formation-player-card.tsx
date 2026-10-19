/**
 * 작성자: KYD
 * 기능: 포메이션 선수 카드 (최신경기 · 경기 평점 공용)
 * 프로세스 설명: 다이아몬드 프레임 + 우하단 평점 배지가 기본이고, 나머지 배지(좌상단 BOTM·주장,
 *              우상단 골, 좌하단 경고·퇴장, 우측 중앙 교체)는 값이 넘어온 화면에서만 나타난다.
 *              두 화면이 같은 코드를 쓰고 정보량만 달라진다.
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
/**
 * 아바타 칸 = 카드 폭의 정사각형. 다이아몬드 대각선이 곧 칸 폭이라, 칸을 카드 폭까지 넓혀야
 * 옆 선수와 겹치지 않는 선에서 다이아몬드가 가장 커진다.
 * `isolate` 로 쌓임맥락을 아바타 하나에 가둬서, 배지끼리의 겹침 순서가 카드 바깥(포메이션 라인,
 * 보드 토글 등)의 z-index 와 섞이지 않게 한다. 배지 순서는 아래 Z_* 로만 정해진다.
 */
const AVATAR_CLASS = "relative isolate aspect-square w-full";

/**
 * 사각형을 45도 돌려 아바타 칸에 내접시킨다. 대각선이 칸 폭과 같아지려면 한 변이 1/√2 ≈ 70.7%,
 * 즉 사방 14.6% 씩 안쪽으로 들어가야 네 꼭짓점이 칸의 변 중앙에 닿는다.
 * 그래서 칸의 네 모서리가 비고, 배지들이 그 빈 모서리에 앉는다.
 *
 * 테두리 색은 yd-ui 의 `border-primary-400` 을 쓰지 않는다. 그 유틸리티는 색과 함께
 * `border-radius: var(--yds-border-radius)`(8px)·border-width 까지 박아 두고 rounded-none 보다
 * 뒤에 선언돼 있어서, 같이 써도 꼭짓점이 둥글게 남는다. 색만 지정하는 임의값으로 대신한다.
 */
const DIAMOND_CLASS = "inset-[14.6%] rotate-45 border-2 border-[var(--color-primary-400)]";
/**
 * 이미지 마스크. 아래 절반은 다이아몬드 V 를 테두리 두께만큼 안쪽으로 따라가 아래 테두리를 살리고,
 * 위 절반은 칸 위로 열어 둬서 머리가 다이아몬드 윗변을 덮고 바깥으로 튀어나오게 한다.
 */
const POP_OUT_CLIP_CLASS =
  "[clip-path:polygon(4px_-40%,calc(100%-4px)_-40%,calc(100%-4px)_50%,50%_calc(100%-5px),4px_50%)]";

/** 아바타 안에서의 배지 겹침 순서 — 평점이 항상 최상단이다 */
const Z_OVERLAY = "z-0";
const Z_BADGE = "z-10";
const Z_RATING = "z-20";
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
        {/* 다이아몬드 배경: 바깥 프레임 + 안쪽 가는 선 두 겹 */}
        <div
          aria-hidden="true"
          className={`absolute ${Z_OVERLAY} ${DIAMOND_CLASS} bg-linear-to-b from-neutral-600/80 to-black/90 shadow-lg`}
        >
          <div className="border-primary-400/40 absolute inset-[3px] border bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.22),transparent_70%)]" />
        </div>

        {/* 선수 이미지: 아랫부분은 다이아몬드 V 자로 잘리고, 머리는 윗변 밖으로 튀어나온다 */}
        <div className={`absolute ${Z_OVERLAY} inset-0 ${POP_OUT_CLIP_CLASS}`}>
          <img
            src={player.imageUrl}
            alt={player.name}
            className="absolute bottom-[4%] left-1/2 h-[108%] w-[108%] max-w-none -translate-x-1/2 object-contain object-bottom drop-shadow-[0_2px_3px_rgba(0,0,0,0.6)]"
          />
        </div>

        {/* 우하단: 평점 — 다이아몬드 바깥 빈 모서리에 앉는다 */}
        <div
          className={`border-primary-400 absolute ${Z_RATING} right-0 bottom-0 flex h-7 w-7 items-center justify-center rounded-full border-2 bg-black shadow-lg`}
        >
          <span className="text-yds-c1r font-bold text-white transition-all duration-300 ease-out">{ratingLabel}</span>
        </div>

        {/* 좌상단: BOTM / 주장 */}
        {player.isBestOfTheMatch ? (
          <div
            className={`border-primary-400 absolute ${Z_BADGE} top-0 left-0 flex h-5 w-5 items-center justify-center rounded-full border bg-black`}
            title="이 경기 최고 평점"
          >
            <Crown size={11} className="text-primary-100" />
          </div>
        ) : player.isCaptain ? (
          <div
            className={`border-primary-400 absolute ${Z_BADGE} top-0 left-0 flex h-5 w-5 items-center justify-center rounded-full border bg-black`}
            title="주장"
          >
            <span className="text-primary-100 text-[9px] font-bold">C</span>
          </div>
        ) : null}

        {/* 우상단: 골 — 넣은 만큼 그대로 */}
        {goals > 0 ? (
          <div
            className={`absolute ${Z_BADGE} top-0 right-0 flex items-center gap-[1px] rounded-full bg-black/80 px-1 py-[1px]`}
          >
            {Array.from({ length: goals }).map((_, index) => (
              <img key={index} src={GOAL_IMAGE} alt="" className="h-3 w-3" />
            ))}
            <span className="sr-only">{goals}골</span>
          </div>
        ) : null}

        {/* 좌하단: 교체 시간(위) → 경고·퇴장(아래).
            둘을 한 컨테이너에 세로로 쌓아 서로 겹칠 일이 없게 하고, z 도 한 번만 준다.
            sub-for-sub 면 IN·OUT 이 둘 다 올라온다 */}
        {isSubstitutedIn || isSubstitutedOut || hasCardBadge ? (
          <div className={`absolute ${Z_BADGE} bottom-0 left-0 flex flex-col items-start gap-[2px]`}>
            {isSubstitutedIn ? (
              <span
                className="flex items-center gap-[1px] rounded-full bg-black/80 px-1 py-[1px]"
                title={`${player.subInMinute}분 교체 투입`}
              >
                <img src={EXCHANGE_IN_IMAGE} alt="" className="h-3 w-3" />
                <span className="text-primary-100 text-[10px] leading-none">{player.subInMinute}'</span>
              </span>
            ) : null}
            {isSubstitutedOut ? (
              <span
                className="flex items-center gap-[1px] rounded-full bg-black/80 px-1 py-[1px]"
                title={`${player.subOutMinute}분 교체 아웃`}
              >
                <img src={EXCHANGE_OUT_IMAGE} alt="" className="h-3 w-3" />
                <span className="text-primary-100 text-[10px] leading-none">{player.subOutMinute}'</span>
              </span>
            ) : null}
            {hasCardBadge ? (
              <span className="flex items-center gap-[1px] rounded-full bg-black/80 px-1 py-[1px]">
                {Array.from({ length: shownYellowCards }).map((_, index) => (
                  <img key={index} src={YELLOW_CARD_IMAGE} alt="" className="h-3 w-3" />
                ))}
                {isSentOff ? <img src={RED_CARD_IMAGE} alt="" className="h-3 w-3" /> : null}
                <span className="sr-only">
                  {isSentOff ? (shownYellowCards > 0 ? "경고 누적 퇴장" : "퇴장") : `경고 ${shownYellowCards}장`}
                </span>
              </span>
            ) : null}
          </div>
        ) : null}
      </div>
    </>
  );

  // 머리가 칸 위로 튀어나오는 만큼 위를 비워 윗줄 카드와 겹치지 않게 한다
  const containerClass = `flex shrink-0 flex-col items-center gap-1 pt-2 sm:pt-2.5 md:pt-3 ${CARD_WIDTH_CLASS}`;

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
