import { describe, expect, it } from "vitest";

import { filterMatches, getTodayKST, sortMatchesByUpcoming } from "@admin/admin-match/utils/sort-matches-by-upcoming";

// get_all_matches 와 같은 최신 날짜순
const MATCHES = [
  { id: "m5", match_date: "2027-05-22", match_start_time: "2027-05-22T13:30:00+00:00" },
  { id: "m4", match_date: "2026-11-08", match_start_time: "2026-11-08T14:30:00+00:00" },
  { id: "m3", match_date: "2026-10-30", match_start_time: "2026-10-30T11:30:00+00:00" },
  { id: "m2", match_date: "2026-10-25", match_start_time: "2026-10-25T13:30:00+00:00" },
  { id: "m1", match_date: "2026-08-23", match_start_time: null },
];

const ids = (matches: { id: string }[]) => matches.map((match) => match.id);

describe("sortMatchesByUpcoming", () => {
  it("오늘 포함 다가오는 경기를 가까운 순으로 위에, 지난 경기를 최근 순으로 아래에 둔다", () => {
    expect(ids(sortMatchesByUpcoming(MATCHES, "2026-10-30"))).toEqual(["m3", "m4", "m5", "m2", "m1"]);
  });

  it("시즌이 끝나 남은 경기가 없으면 최근 경기부터 보인다", () => {
    expect(ids(sortMatchesByUpcoming(MATCHES, "2027-06-01"))).toEqual(["m5", "m4", "m3", "m2", "m1"]);
  });

  it("같은 날 경기는 킥오프 시간으로 가른다", () => {
    const sameDay = [
      { id: "late", match_date: "2026-11-08", match_start_time: "2026-11-08T16:30:00+00:00" },
      { id: "early", match_date: "2026-11-08", match_start_time: "2026-11-08T13:30:00+00:00" },
    ];
    expect(ids(sortMatchesByUpcoming(sameDay, "2026-10-30"))).toEqual(["early", "late"]);
  });

  it("원본 배열은 바꾸지 않는다", () => {
    const original = [...MATCHES];
    sortMatchesByUpcoming(MATCHES, "2026-10-30");
    expect(MATCHES).toEqual(original);
  });
});

describe("getTodayKST", () => {
  it("UTC 15:00 이후는 KST 다음 날이다", () => {
    expect(getTodayKST(new Date("2026-10-30T15:30:00Z"))).toBe("2026-10-31");
  });

  it("UTC 15:00 이전은 KST 같은 날이다", () => {
    expect(getTodayKST(new Date("2026-10-30T14:30:00Z"))).toBe("2026-10-30");
  });
});

describe("filterMatches", () => {
  const matches = [
    { id: "live", match_date: "2026-10-30", match_start_time: null, is_live: true },
    { id: "upcoming", match_date: "2026-11-08", match_start_time: null, is_live: false },
    { id: "past", match_date: "2026-10-25", match_start_time: null, is_live: false },
  ];

  it("예정은 오늘 이후 경기와 라이브 경기를 반환한다", () => {
    expect(ids(filterMatches(matches, "2026-10-30", "upcoming"))).toEqual(["live", "upcoming"]);
  });

  it("자정을 넘겨 날짜가 지난 라이브 경기도 예정에 남고 지난 경기에서는 빠진다", () => {
    expect(ids(filterMatches(matches, "2026-10-31", "upcoming"))).toEqual(["live", "upcoming"]);
    expect(ids(filterMatches(matches, "2026-10-31", "past"))).toEqual(["past"]);
  });

  it("라이브는 라이브 경기만, 전체는 모든 경기를 반환한다", () => {
    expect(ids(filterMatches(matches, "2026-10-30", "live"))).toEqual(["live"]);
    expect(ids(filterMatches(matches, "2026-10-30", "all"))).toEqual(["live", "upcoming", "past"]);
  });
});
