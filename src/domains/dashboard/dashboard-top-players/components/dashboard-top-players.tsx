/**
 * 작성자: KYD
 * 기능: TOP PLAYERS 카드 - 4가지 개인 기록 리더를 2x2 격자로 표시
 * 프로세스 설명: get_dashboard_record_leaders RPC로 ①단일경기 최고평점 ②통산 평균 최고 ③최다 골 ④최다 어시
 *              4가지 기록의 1위 선수를 카드로 노출한다. 데이터가 없는 기록은 placeholder로 표시.
 */
import { Link } from "react-router-dom";

import DashboardTopPlayersWrapper from "./wrapper/dashboard-top-players-wrapper";
import { Card } from "@youngduck/yd-ui/Cards";

import {
  type IRecordLeader,
  type RecordCategory,
} from "@dashboard/dashboard-top-players/api/dashboard-top-players-api";
import { useGetRecordLeadersSuspense } from "@dashboard/dashboard-top-players/api/react-query-api/use-get-record-leaders";

import { createPlayerStatsPath } from "@shared/constants/routes";

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

const RecordCard = ({ meta, leader }: { meta: ICategoryMeta; leader?: IRecordLeader }) => {
  // 해당 기록 데이터가 없는 경우 placeholder
  if (!leader) {
    return (
      <Card variant="outlined" className="relative flex h-[160px] flex-col justify-between overflow-hidden p-3">
        <span className="text-primary-100 text-yds-c2r">{meta.label}</span>
        <span className="text-yds-c1m text-primary-100">기록 없음</span>
      </Card>
    );
  }

  const nameLines = splitNameLines(leader.korean_name);

  return (
    <Card variant="outlined" className="relative h-[160px] overflow-hidden p-3">
      <Link
        to={createPlayerStatsPath(leader.player_id)}
        className="flex h-full flex-col justify-between hover:cursor-pointer"
      >
        <div className="z-10 flex flex-col leading-tight">
          <span className="text-primary-100 text-yds-c2r mb-1">{meta.label}</span>
          {nameLines.map((line, index) => (
            <span key={index} className="text-yds-b2 font-bold text-white">
              {line}
            </span>
          ))}
        </div>
        <div className="z-10 flex flex-col">
          <span className="text-yds-s1 font-bold text-white">{meta.format(Number(leader.metric_value))}</span>
        </div>
        <img
          src={leader.full_profile_image_url ?? leader.head_profile_image_url ?? undefined}
          alt={leader.korean_name ?? undefined}
          loading="lazy"
          onError={(event) => {
            if (leader.head_profile_image_url) event.currentTarget.src = leader.head_profile_image_url;
          }}
          className="pointer-events-none absolute -right-2 bottom-0 h-[130px] w-auto object-contain object-bottom"
        />
      </Link>
    </Card>
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
