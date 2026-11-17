/**
 * 작성자: KYD
 * 기능: 국가별 팀 수를 상위 N개국 + "기타"로 묶는다
 * 프로세스 설명: 팀은 한두 나라(독일)에 몰리고 나머지는 1팀짜리가 길게 늘어선다. 전부 막대로 그리면
 *              짧은 막대만 줄지어 차트가 휑해지므로, 상위 국가만 보여주고 나머지는 한 막대로 합친다.
 *              RPC 가 이미 팀 수 많은 순으로 내려주므로 순서는 그대로 쓴다.
 */
import type { ITeamCountByCountry } from "@admin/admin-team/api/admin-team-country-count-api";

/** 차트에 국가 이름으로 보여줄 최대 개수. 넘치면 (이 값 - 1)개 + 기타 1개로 같은 줄 수를 유지한다 */
export const TOP_COUNTRY_LIMIT = 7;

export interface ICountryBar {
  label: string;
  teamCount: number;
  /** "기타"로 묶인 국가 이름들 (툴팁용). 묶이지 않은 막대는 빈 배열 */
  groupedNames: string[];
}

export const groupTopCountries = (
  countryCounts: ITeamCountByCountry[],
  limit: number = TOP_COUNTRY_LIMIT,
): ICountryBar[] => {
  const toBar = (country: ITeamCountByCountry): ICountryBar => ({
    label: country.country_name,
    teamCount: country.team_count,
    groupedNames: [],
  });

  if (countryCounts.length <= limit) return countryCounts.map(toBar);

  const top = countryCounts.slice(0, limit - 1);
  const rest = countryCounts.slice(limit - 1);
  return [
    ...top.map(toBar),
    {
      label: `기타 ${rest.length}개국`,
      teamCount: rest.reduce((sum, country) => sum + country.team_count, 0),
      groupedNames: rest.map((country) => country.country_name),
    },
  ];
};
