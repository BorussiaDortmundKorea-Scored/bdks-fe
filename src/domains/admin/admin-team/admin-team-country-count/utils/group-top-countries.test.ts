/**
 * 작성자: KYD
 * 기능: 상위 N개국 + 기타 묶기 테스트
 */
import { describe, expect, it } from "vitest";

import { groupTopCountries } from "@admin/admin-team/admin-team-country-count/utils/group-top-countries";

const country = (name: string, count: number) => ({ country_id: name, country_name: name, team_count: count });

describe("groupTopCountries", () => {
  it("한도 이하면 그대로 막대로 바꾼다", () => {
    const result = groupTopCountries([country("독일", 5), country("영국", 2)], 3);

    expect(result).toEqual([
      { label: "독일", teamCount: 5, groupedNames: [] },
      { label: "영국", teamCount: 2, groupedNames: [] },
    ]);
  });

  it("한도를 넘으면 (한도-1)개 + 기타 1개로 같은 줄 수를 유지한다", () => {
    const result = groupTopCountries(
      [country("독일", 22), country("스페인", 4), country("영국", 3), country("터키", 1), country("그리스", 1)],
      3,
    );

    expect(result).toHaveLength(3);
    expect(result[2]).toEqual({ label: "기타 3개국", teamCount: 5, groupedNames: ["영국", "터키", "그리스"] });
  });

  it("묶어도 팀 합계는 바뀌지 않는다", () => {
    const input = Array.from({ length: 14 }, (_, i) => country(`국가${i}`, 14 - i));
    const sum = (n: number[]) => n.reduce((a, b) => a + b, 0);

    expect(sum(groupTopCountries(input).map((bar) => bar.teamCount))).toBe(sum(input.map((c) => c.team_count)));
  });
});
