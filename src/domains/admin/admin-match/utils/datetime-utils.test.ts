import { describe, expect, it } from "vitest";

import {
  calculateMatchTimes,
  convertLocalToUTC,
  convertUTCToLocal,
  extractKSTDateFromLocal,
} from "@admin/admin-match/utils/datetime-utils";

// 분데스리가 한국시간 킥오프 시간대: 22:30, 23:30, 00:30, 01:30, 03:30, 04:30

describe("convertLocalToUTC - 분데스리가, 챔피언스리그, 포칼컵등 대회 킥오프 시간대", () => {
  it("KST 22:30 → UTC 13:30 (같은 날)", () => {
    expect(convertLocalToUTC("2026-04-05T22:30")).toBe("2026-04-05T13:30:00.000Z");
  });

  it("KST 23:30 → UTC 14:30 (같은 날)", () => {
    expect(convertLocalToUTC("2026-04-05T23:30")).toBe("2026-04-05T14:30:00.000Z");
  });

  it("KST 00:30 → UTC 전날 15:30", () => {
    expect(convertLocalToUTC("2026-04-05T00:30")).toBe("2026-04-04T15:30:00.000Z");
  });

  it("KST 01:30 → UTC 전날 16:30", () => {
    expect(convertLocalToUTC("2026-04-05T01:30")).toBe("2026-04-04T16:30:00.000Z");
  });

  it("KST 03:30 → UTC 전날 18:30", () => {
    expect(convertLocalToUTC("2026-04-05T03:30")).toBe("2026-04-04T18:30:00.000Z");
  });

  it("KST 04:30 → UTC 전날 19:30", () => {
    expect(convertLocalToUTC("2026-04-05T04:30")).toBe("2026-04-04T19:30:00.000Z");
  });

  it("빈 문자열은 빈 문자열 반환", () => {
    expect(convertLocalToUTC("")).toBe("");
  });
});

describe("convertUTCToLocal - 분데스리가 킥오프 시간대", () => {
  it("UTC 13:30 → KST 22:30", () => {
    expect(convertUTCToLocal("2026-04-05T13:30:00.000Z")).toBe("2026-04-05T22:30");
  });

  it("UTC 14:30 → KST 23:30", () => {
    expect(convertUTCToLocal("2026-04-05T14:30:00.000Z")).toBe("2026-04-05T23:30");
  });

  it("UTC 15:30 → KST 다음날 00:30", () => {
    expect(convertUTCToLocal("2026-04-04T15:30:00.000Z")).toBe("2026-04-05T00:30");
  });

  it("UTC 16:30 → KST 다음날 01:30", () => {
    expect(convertUTCToLocal("2026-04-04T16:30:00.000Z")).toBe("2026-04-05T01:30");
  });

  it("null/undefined/빈 문자열은 빈 문자열 반환", () => {
    expect(convertUTCToLocal(null)).toBe("");
    expect(convertUTCToLocal(undefined)).toBe("");
    expect(convertUTCToLocal("")).toBe("");
  });
});

describe("KST → UTC → KST 왕복 변환", () => {
  const kickoffTimes = ["22:30", "23:30", "00:30", "01:30", "03:30", "04:30"];

  kickoffTimes.forEach((time) => {
    it(`KST ${time} 왕복 변환이 원본과 동일해야 한다`, () => {
      const original = `2026-04-05T${time}`;
      expect(convertUTCToLocal(convertLocalToUTC(original))).toBe(original);
    });
  });
});

describe("extractKSTDateFromLocal - 경기일 추출", () => {
  it("새벽 경기도 KST 기준 날짜로 추출해야 한다", () => {
    expect(extractKSTDateFromLocal("2026-04-05T01:30")).toBe("2026-04-05");
  });

  it("밤 경기도 KST 기준 날짜로 추출해야 한다", () => {
    expect(extractKSTDateFromLocal("2026-04-05T22:30")).toBe("2026-04-05");
  });

  it("빈 문자열은 빈 문자열 반환", () => {
    expect(extractKSTDateFromLocal("")).toBe("");
  });
});

describe("calculateMatchTimes - 분데스리가 킥오프별 자동계산", () => {
  it("KST 22:30 - 후반종료 00:15(다음날)", () => {
    const result = calculateMatchTimes("2026-04-05T22:30");

    expect(result.match_start_time).toBe("2026-04-05T22:30");
    expect(result.first_half_end_time).toBe("2026-04-05T23:15");
    expect(result.second_half_start_time).toBe("2026-04-05T23:30");
    expect(result.second_half_end_time).toBe("2026-04-06T00:15");
  });

  it("KST 23:30 - 전반종료부터 자정 넘김", () => {
    const result = calculateMatchTimes("2026-04-05T23:30");

    expect(result.match_start_time).toBe("2026-04-05T23:30");
    expect(result.first_half_end_time).toBe("2026-04-06T00:15");
    expect(result.second_half_start_time).toBe("2026-04-06T00:30");
    expect(result.second_half_end_time).toBe("2026-04-06T01:15");
  });

  it("KST 00:30 - 새벽 0:30 경기, 같은 날 내에서 종료", () => {
    const result = calculateMatchTimes("2026-04-05T00:30");

    expect(result.match_start_time).toBe("2026-04-05T00:30");
    expect(result.first_half_end_time).toBe("2026-04-05T01:15");
    expect(result.second_half_start_time).toBe("2026-04-05T01:30");
    expect(result.second_half_end_time).toBe("2026-04-05T02:15");
  });

  it("KST 01:30 - 새벽 1:30 경기, 같은 날 내에서 종료", () => {
    const result = calculateMatchTimes("2026-04-05T01:30");

    expect(result.match_start_time).toBe("2026-04-05T01:30");
    expect(result.first_half_end_time).toBe("2026-04-05T02:15");
    expect(result.second_half_start_time).toBe("2026-04-05T02:30");
    expect(result.second_half_end_time).toBe("2026-04-05T03:15");
  });

  it("KST 03:30 - 새벽 3:30 경기, 같은 날 내에서 종료", () => {
    const result = calculateMatchTimes("2026-04-05T03:30");

    expect(result.match_start_time).toBe("2026-04-05T03:30");
    expect(result.first_half_end_time).toBe("2026-04-05T04:15");
    expect(result.second_half_start_time).toBe("2026-04-05T04:30");
    expect(result.second_half_end_time).toBe("2026-04-05T05:15");
  });

  it("KST 04:30 - 새벽 4:30 경기, 같은 날 내에서 종료", () => {
    const result = calculateMatchTimes("2026-04-05T04:30");

    expect(result.match_start_time).toBe("2026-04-05T04:30");
    expect(result.first_half_end_time).toBe("2026-04-05T05:15");
    expect(result.second_half_start_time).toBe("2026-04-05T05:30");
    expect(result.second_half_end_time).toBe("2026-04-05T06:15");
  });

  it("빈 문자열은 빈 시간들을 반환", () => {
    const result = calculateMatchTimes("");

    expect(result.match_start_time).toBe("");
    expect(result.first_half_end_time).toBe("");
    expect(result.second_half_start_time).toBe("");
    expect(result.second_half_end_time).toBe("");
  });
});

describe("calculateMatchTimes + convertLocalToUTC 통합 - 자정 넘김 UTC 검증", () => {
  it("KST 22:30 경기의 후반종료(다음날 00:15)가 UTC로 올바르게 변환되어야 한다", () => {
    const times = calculateMatchTimes("2026-04-05T22:30");

    expect(convertLocalToUTC(times.match_start_time)).toBe("2026-04-05T13:30:00.000Z");
    expect(convertLocalToUTC(times.second_half_end_time)).toBe("2026-04-05T15:15:00.000Z");
  });

  it("KST 01:30 새벽 경기의 match_date는 KST 기준이고, UTC는 전날이어야 한다", () => {
    const times = calculateMatchTimes("2026-04-05T01:30");

    expect(extractKSTDateFromLocal(times.match_start_time)).toBe("2026-04-05");
    expect(convertLocalToUTC(times.match_start_time)).toBe("2026-04-04T16:30:00.000Z");
  });
});
