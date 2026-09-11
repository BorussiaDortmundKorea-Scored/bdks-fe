/**
 * 작성자: KYD
 * 기능: TOP PLAYERS 카드 - 4가지 개인 기록 리더를 2x2 격자로 표시
 * 프로세스 설명: get_dashboard_record_leaders RPC로 ①단일경기 최고평점 ②통산 평균 최고 ③최다 골 ④최다 어시
 *              4가지 기록의 1위 선수를 카드로 노출한다. 데이터가 없는 기록은 placeholder로 표시.
 */
import { Link } from "react-router-dom";

import DashboardTopPlayersWrapper from "./wrapper/dashboard-top-players-wrapper";

import {
  type IRecordLeader,
  type RecordCategory,
} from "@dashboard/dashboard-top-players/api/dashboard-top-players-api";
import { useGetRecordLeadersSuspense } from "@dashboard/dashboard-top-players/api/react-query-api/use-get-record-leaders";

import { createPlayerStatsPath } from "@shared/constants/routes";
import { SUPABASE_STORAGE_URL } from "@shared/constants/supabse-storage";

//SECTION 리렌더링이 불필요한영역: 매직넘버, 문자열, 상수
const RECORD_CARD_BACKGROUND_IMAGE = `${SUPABASE_STORAGE_URL}/dortmund/fixtures.png`;
// yd-ui Card 대신 직접 마크업한다 (테두리 없이 배경 이미지를 깔아야 해서)
const RECORD_CARD_CLASS = "relative h-[160px] overflow-hidden rounded-lg";
//!SECTION 리렌더링이 불필요한영역: 매직넘버, 문자열, 상수

interface ICategoryMeta {
  key: RecordCategory;
  label: string;
  /** 값 포맷 (평점=소수, 골/어시=정수+단위) */
  format: (value: number) => string;
}

// 표시 순서/라벨/포맷 정의 (항상 4칸 고정)
const CATEGORIES: ICategoryMeta[] = [
  { key: "best_match", label: "단일 경기 최고 평점", format: (v) => v.toFixed(1) },
  { key: "best_avg", label: "통산 평균 평점", format: (v) => v.toFixed(1) },
  { key: "top_scorer", label: "이번 시즌 최다 골", format: (v) => `${v}골` },
  { key: "top_assist", label: "이번 시즌 최다 도움", format: (v) => `${v}도움` },
];

/** 이름을 두 줄로 분리 (첫 단어 / 나머지). 단어가 하나면 한 줄 */
const splitNameLines = (name: string | null): string[] => {
  const parts = (name ?? "").trim().split(/\s+/).filter(Boolean);
  if (parts.length <= 1) return parts;
  return [parts[0], parts.slice(1).join(" ")];
};

/** 카드 배경 이미지 + 가독성 확보용 딤 (장식용이라 alt 비움) */
const RecordCardBackground = () => (
  <>
    <img
      src={RECORD_CARD_BACKGROUND_IMAGE}
      alt=""
      aria-hidden="true"
      className="absolute inset-0 h-full w-full object-cover"
      loading="lazy"
      decoding="async"
    />
    <div aria-hidden="true" className="bg-background-primary/70 absolute inset-0" />
  </>
);

const RecordCard = ({ meta, leader }: { meta: ICategoryMeta; leader?: IRecordLeader }) => {
  // 해당 기록 데이터가 없는 경우 placeholder
  if (!leader) {
    return (
      <div className={RECORD_CARD_CLASS}>
        <RecordCardBackground />
        <div className="relative flex h-full flex-col justify-between p-3">
          <span className="text-primary-100 text-yds-c2r">{meta.label}</span>
          <span className="text-yds-c1m text-primary-100">기록 없음</span>
        </div>
      </div>
    );
  }

  const nameLines = splitNameLines(leader.korean_name);

  return (
    <div className={RECORD_CARD_CLASS}>
      <RecordCardBackground />

      <Link
        to={createPlayerStatsPath(leader.player_id)}
        className="relative flex h-full flex-col justify-between p-3 hover:cursor-pointer"
      >
        <div className="flex flex-col leading-tight">
          <span className="text-primary-100 text-yds-c2r mb-1">{meta.label}</span>
          {nameLines.map((line, index) => (
            <span key={index} className="text-yds-b2 font-bold text-white">
              {line}
            </span>
          ))}
        </div>
        <div className="flex flex-col">
          <span className="text-yds-s1 font-bold text-white">{meta.format(Number(leader.metric_value))}</span>
        </div>
      </Link>

      {/* 선수 이미지는 Link 밖(뒤)에 둬서 기존처럼 텍스트 위에 겹쳐 그린다. pointer-events-none 이라 클릭에는 영향 없음 */}
      <img
        src={leader.full_profile_image_url ?? leader.head_profile_image_url ?? undefined}
        alt={leader.korean_name ?? undefined}
        loading="lazy"
        onError={(event) => {
          if (leader.head_profile_image_url) event.currentTarget.src = leader.head_profile_image_url;
        }}
        className="pointer-events-none absolute -right-2 bottom-0 h-[130px] w-auto object-contain object-bottom"
      />
    </div>
  );
};

const DashboardTopPlayers = () => {
  //SECTION HOOK,상태값 영역
  const leaders = useGetRecordLeadersSuspense();
  //!SECTION HOOK,상태값 영역

  //SECTION 메서드 영역
  const leaderByCategory = new Map(leaders.map((leader) => [leader.category, leader]));
  //!SECTION 메서드 영역

  return (
    <DashboardTopPlayersWrapper>
      <div className="grid grid-cols-2 gap-3">
        {CATEGORIES.map((meta) => (
          <RecordCard key={meta.key} meta={meta} leader={leaderByCategory.get(meta.key)} />
        ))}
      </div>
    </DashboardTopPlayersWrapper>
  );
};

export default DashboardTopPlayers;
