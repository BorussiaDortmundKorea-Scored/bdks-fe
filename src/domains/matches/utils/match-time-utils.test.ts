import { describe, expect, it } from "vitest";

import {
  MATCH_DISPLAY_TEXT,
  MATCH_STATUS,
  getDisplayTime,
  getMatchStatus,
} from "@matches/utils/match-time-utils";

import { calculateMatchTimes } from "@admin/admin-match/utils/datetime-utils";

/**
 * 헬퍼: KST datetime-local 문자열을 Date 객체로 변환
 */
const kstToDate = (kstString: string): Date => {
  const [datePart, timePart] = kstString.split("T");
  return new Date(`${datePart}T${timePart}:00+09:00`);
};

/**
 * 헬퍼: 킥오프 시간으로 4개 Date 생성 (calculateMatchTimes 활용)
 */
const createMatchDates = (kickoffKST: string) => {
  const times = calculateMatchTimes(kickoffKST);
  return {
    matchStart: kstToDate(times.match_start_time),
    firstHalfEnd: kstToDate(times.first_half_end_time),
    secondHalfStart: kstToDate(times.second_half_start_time),
    secondHalfEnd: kstToDate(times.second_half_end_time),
  };
};

describe("getMatchStatus - KST 22:30 경기 (후반 자정 넘김)", () => {
  const { matchStart, firstHalfEnd, secondHalfStart, secondHalfEnd } = createMatchDates("2026-04-05T22:30");

  it("경기 전 (22:00)", () => {
    expect(getMatchStatus(matchStart, firstHalfEnd, secondHalfStart, secondHalfEnd, kstToDate("2026-04-05T22:00"))).toBe(MATCH_STATUS.NOT_STARTED);
  });

  it("전반 진행 중 (23:00)", () => {
    expect(getMatchStatus(matchStart, firstHalfEnd, secondHalfStart, secondHalfEnd, kstToDate("2026-04-05T23:00"))).toBe(MATCH_STATUS.FIRST_HALF);
  });

  it("하프타임 (23:20)", () => {
    expect(getMatchStatus(matchStart, firstHalfEnd, secondHalfStart, secondHalfEnd, kstToDate("2026-04-05T23:20"))).toBe(MATCH_STATUS.HALF_TIME);
  });

  it("후반 진행 중 - 자정 넘김 (다음날 00:00)", () => {
    expect(getMatchStatus(matchStart, firstHalfEnd, secondHalfStart, secondHalfEnd, kstToDate("2026-04-06T00:00"))).toBe(MATCH_STATUS.SECOND_HALF);
  });

  it("경기 종료 (다음날 00:30)", () => {
    expect(getMatchStatus(matchStart, firstHalfEnd, secondHalfStart, secondHalfEnd, kstToDate("2026-04-06T00:30"))).toBe(MATCH_STATUS.FULL_TIME);
  });
});

describe("getMatchStatus - KST 23:30 경기 (전반종료부터 자정 넘김)", () => {
  const { matchStart, firstHalfEnd, secondHalfStart, secondHalfEnd } = createMatchDates("2026-04-05T23:30");

  it("전반 진행 중 (23:50)", () => {
    expect(getMatchStatus(matchStart, firstHalfEnd, secondHalfStart, secondHalfEnd, kstToDate("2026-04-05T23:50"))).toBe(MATCH_STATUS.FIRST_HALF);
  });

  it("전반 진행 중 - 자정 넘김 (다음날 00:10)", () => {
    expect(getMatchStatus(matchStart, firstHalfEnd, secondHalfStart, secondHalfEnd, kstToDate("2026-04-06T00:10"))).toBe(MATCH_STATUS.FIRST_HALF);
  });

  it("하프타임 (다음날 00:20)", () => {
    expect(getMatchStatus(matchStart, firstHalfEnd, secondHalfStart, secondHalfEnd, kstToDate("2026-04-06T00:20"))).toBe(MATCH_STATUS.HALF_TIME);
  });

  it("후반 진행 중 (다음날 01:00)", () => {
    expect(getMatchStatus(matchStart, firstHalfEnd, secondHalfStart, secondHalfEnd, kstToDate("2026-04-06T01:00"))).toBe(MATCH_STATUS.SECOND_HALF);
  });

  it("경기 종료 (다음날 01:20)", () => {
    expect(getMatchStatus(matchStart, firstHalfEnd, secondHalfStart, secondHalfEnd, kstToDate("2026-04-06T01:20"))).toBe(MATCH_STATUS.FULL_TIME);
  });
});

describe("getMatchStatus - KST 00:30 경기 (새벽)", () => {
  const { matchStart, firstHalfEnd, secondHalfStart, secondHalfEnd } = createMatchDates("2026-04-05T00:30");

  it("경기 전 (00:00)", () => {
    expect(getMatchStatus(matchStart, firstHalfEnd, secondHalfStart, secondHalfEnd, kstToDate("2026-04-05T00:00"))).toBe(MATCH_STATUS.NOT_STARTED);
  });

  it("전반 진행 중 (01:00)", () => {
    expect(getMatchStatus(matchStart, firstHalfEnd, secondHalfStart, secondHalfEnd, kstToDate("2026-04-05T01:00"))).toBe(MATCH_STATUS.FIRST_HALF);
  });

  it("경기 종료 (02:30)", () => {
    expect(getMatchStatus(matchStart, firstHalfEnd, secondHalfStart, secondHalfEnd, kstToDate("2026-04-05T02:30"))).toBe(MATCH_STATUS.FULL_TIME);
  });
});

describe("getMatchStatus - KST 01:30 경기 (슈튜트가르트 케이스)", () => {
  const { matchStart, firstHalfEnd, secondHalfStart, secondHalfEnd } = createMatchDates("2026-04-05T01:30");

  it("전반 진행 중 (02:00)", () => {
    expect(getMatchStatus(matchStart, firstHalfEnd, secondHalfStart, secondHalfEnd, kstToDate("2026-04-05T02:00"))).toBe(MATCH_STATUS.FIRST_HALF);
  });

  it("하프타임 (02:20)", () => {
    expect(getMatchStatus(matchStart, firstHalfEnd, secondHalfStart, secondHalfEnd, kstToDate("2026-04-05T02:20"))).toBe(MATCH_STATUS.HALF_TIME);
  });

  it("경기 종료 (03:30)", () => {
    expect(getMatchStatus(matchStart, firstHalfEnd, secondHalfStart, secondHalfEnd, kstToDate("2026-04-05T03:30"))).toBe(MATCH_STATUS.FULL_TIME);
  });
});

describe("getMatchStatus - KST 03:30 / 04:30 경기", () => {
  it("KST 03:30 경기 - 후반 진행 중 (04:40)", () => {
    const { matchStart, firstHalfEnd, secondHalfStart, secondHalfEnd } = createMatchDates("2026-04-05T03:30");
    expect(getMatchStatus(matchStart, firstHalfEnd, secondHalfStart, secondHalfEnd, kstToDate("2026-04-05T04:40"))).toBe(MATCH_STATUS.SECOND_HALF);
  });

  it("KST 04:30 경기 - 경기 종료 (06:30)", () => {
    const { matchStart, firstHalfEnd, secondHalfStart, secondHalfEnd } = createMatchDates("2026-04-05T04:30");
    expect(getMatchStatus(matchStart, firstHalfEnd, secondHalfStart, secondHalfEnd, kstToDate("2026-04-05T06:30"))).toBe(MATCH_STATUS.FULL_TIME);
  });
});

describe("getDisplayTime - 자정 넘김 표시 텍스트", () => {
  it("KST 22:30 경기 - 전반 30분 (23:00)", () => {
    const { matchStart, firstHalfEnd, secondHalfStart, secondHalfEnd } = createMatchDates("2026-04-05T22:30");
    expect(getDisplayTime(matchStart, firstHalfEnd, secondHalfStart, secondHalfEnd, kstToDate("2026-04-05T23:00"))).toMatch(/^전반 30분/);
  });

  it("KST 22:30 경기 - 하프타임 (23:20)", () => {
    const { matchStart, firstHalfEnd, secondHalfStart, secondHalfEnd } = createMatchDates("2026-04-05T22:30");
    expect(getDisplayTime(matchStart, firstHalfEnd, secondHalfStart, secondHalfEnd, kstToDate("2026-04-05T23:20"))).toBe(MATCH_DISPLAY_TEXT.HALF_TIME);
  });

  it("KST 23:30 경기 - 전반 40분 자정 넘김 (다음날 00:10)", () => {
    const { matchStart, firstHalfEnd, secondHalfStart, secondHalfEnd } = createMatchDates("2026-04-05T23:30");
    expect(getDisplayTime(matchStart, firstHalfEnd, secondHalfStart, secondHalfEnd, kstToDate("2026-04-06T00:10"))).toMatch(/^전반 40분/);
  });

  it("KST 01:30 경기 - 후반 20분 (02:50)", () => {
    const { matchStart, firstHalfEnd, secondHalfStart, secondHalfEnd } = createMatchDates("2026-04-05T01:30");
    expect(getDisplayTime(matchStart, firstHalfEnd, secondHalfStart, secondHalfEnd, kstToDate("2026-04-05T02:50"))).toMatch(/^후반 20분/);
  });

  it("KST 04:30 경기 - 경기 종료 (06:30)", () => {
    const { matchStart, firstHalfEnd, secondHalfStart, secondHalfEnd } = createMatchDates("2026-04-05T04:30");
    expect(getDisplayTime(matchStart, firstHalfEnd, secondHalfStart, secondHalfEnd, kstToDate("2026-04-05T06:30"))).toBe(MATCH_DISPLAY_TEXT.FULL_TIME);
  });
});
