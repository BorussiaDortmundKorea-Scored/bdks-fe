/**
 * 작성자: KYD
 * 기능: 경기 목록을 다가오는 경기 기준으로 정렬하는 유틸
 * 프로세스 설명: 시즌 전체 일정을 넣어 두면 최신 날짜순으로는 오늘 근처 경기가 한참 아래에 묻힌다.
 *              오늘(KST, 포함) 이후 경기를 가까운 날짜부터 위에 두고, 지난 경기는 그 아래에 최근 날짜부터 둔다.
 */
import { convertUTCToLocal } from "@admin/admin-match/utils/datetime-utils";

interface IMatchSchedule {
  match_date: string;
  match_start_time: string | null;
}

/**
 * 경기 목록 보기 필터 (기간·상태를 한 축으로 합친 것)
 * - upcoming: 오늘(KST) 이후 + 라이브 중인 경기 (자정을 넘긴 라이브 경기도 여기서 보이게)
 * - live: 라이브 중인 경기
 * - past: 라이브가 아닌 지난 경기
 * - all: 전체
 */
export const MATCH_VIEW_FILTERS = ["upcoming", "live", "past", "all"] as const;
export type MatchViewFilter = (typeof MATCH_VIEW_FILTERS)[number];

export const isMatchViewFilter = (value: unknown): value is MatchViewFilter =>
  MATCH_VIEW_FILTERS.includes(value as MatchViewFilter);

/** 오늘 날짜를 KST 기준 YYYY-MM-DD 로 */
export const getTodayKST = (now: Date = new Date()): string => convertUTCToLocal(now).split("T")[0];

// 같은 날 경기가 여럿이면 킥오프 시간으로 가른다 (ISO 문자열은 문자열 비교가 곧 시간 비교)
const compareSchedule = (a: IMatchSchedule, b: IMatchSchedule) =>
  a.match_date.localeCompare(b.match_date) || (a.match_start_time ?? "").localeCompare(b.match_start_time ?? "");

/** 원본은 건드리지 않고 정렬된 새 배열을 돌려준다 */
export const sortMatchesByUpcoming = <T extends IMatchSchedule>(matches: T[], todayKST: string): T[] => {
  const upcoming = matches.filter((match) => match.match_date >= todayKST).sort(compareSchedule);
  const past = matches.filter((match) => match.match_date < todayKST).sort((a, b) => compareSchedule(b, a));
  return [...upcoming, ...past];
};

export const filterMatches = <T extends IMatchSchedule & { is_live: boolean | null }>(
  matches: T[],
  todayKST: string,
  view: MatchViewFilter,
): T[] =>
  matches.filter((match) => {
    const isLive = match.is_live === true;
    switch (view) {
      case "upcoming":
        return isLive || match.match_date >= todayKST;
      case "live":
        return isLive;
      case "past":
        return !isLive && match.match_date < todayKST;
      case "all":
        return true;
    }
  });
