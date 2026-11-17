/**
 * 작성자: KYD
 * 기능: 팀 현황 요약 카드 — 전체 팀 수 / 등록 국가 수 / 국가 미지정 팀 수
 * 프로세스 설명: 국가별 팀 수 차트와 같은 get_team_count_by_country 결과를 쓴다 (훅은 공통 부모 admin-team/api, 같은 쿼리 키라 요청은 한 번).
 *              국가 미지정(country_id = null) 팀은 정리할 대상이라 1팀 이상이면 강조한다.
 */
import AdminTeamSummaryWrapper from "@admin/admin-team/admin-team-summary/components/wrapper/admin-team-summary-wrapper";
import { useGetTeamCountByCountrySuspense } from "@admin/admin-team/api/react-query-api/use-get-team-count-by-country-suspense";

interface ISummaryStat {
  label: string;
  value: number;
  unit: string;
  highlight?: boolean;
}

const AdminTeamSummary = () => {
  //SECTION HOOK호출 영역
  const { data: countryCounts } = useGetTeamCountByCountrySuspense();
  //!SECTION HOOK호출 영역

  //SECTION 상태값 영역
  const totalTeamCount = countryCounts.reduce((sum, country) => sum + country.team_count, 0);
  const assignedCountryCount = countryCounts.filter((country) => country.country_id !== null).length;
  const unassignedTeamCount = countryCounts.find((country) => country.country_id === null)?.team_count ?? 0;

  const stats: ISummaryStat[] = [
    { label: "전체 팀", value: totalTeamCount, unit: "팀" },
    { label: "등록 국가", value: assignedCountryCount, unit: "개국" },
    { label: "국가 미지정", value: unassignedTeamCount, unit: "팀", highlight: unassignedTeamCount > 0 },
  ];
  //!SECTION 상태값 영역

  return (
    <AdminTeamSummaryWrapper>
      <dl className="grid w-full flex-1 grid-cols-3 items-center divide-x divide-white/10">
        {stats.map((stat) => (
          <div key={stat.label} className="flex flex-col gap-1 px-4 first:pl-0 last:pr-0">
            <dt className="text-yds-c1m text-primary-100/70 whitespace-nowrap">{stat.label}</dt>
            <dd
              data-testid={`admin-team-summary-${stat.label}`}
              className={`flex items-baseline gap-0.5 whitespace-nowrap ${stat.highlight ? "text-primary-400" : "text-white"}`}
            >
              <span className="text-yds-h2">{stat.value.toLocaleString()}</span>
              <span className="text-yds-c1m">{stat.unit}</span>
            </dd>
          </div>
        ))}
      </dl>
    </AdminTeamSummaryWrapper>
  );
};

export default AdminTeamSummary;
