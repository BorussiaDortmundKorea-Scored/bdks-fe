/**
 * 작성자: KYD
 * 기능: 국가별 팀 수 카드 (세로 막대 차트)
 * 프로세스 설명: get_team_count_by_country 결과를 상위 국가 + "기타"로 묶어 대시보드 차트 카드와 같은 모양으로 그린다.
 *              팀 추가·수정·삭제 시 팀 목록 키 무효화에 함께 걸려 자동 갱신된다 (쿼리 키 파일 참고).
 */
import AdminTeamCountryCountChart from "@admin/admin-team/admin-team-country-count/components/admin-team-country-count-chart";
import AdminTeamCountryCountWrapper from "@admin/admin-team/admin-team-country-count/components/wrapper/admin-team-country-count-wrapper";
import { groupTopCountries } from "@admin/admin-team/admin-team-country-count/utils/group-top-countries";
import { useGetTeamCountByCountrySuspense } from "@admin/admin-team/api/react-query-api/use-get-team-count-by-country-suspense";

const AdminTeamCountryCount = () => {
  //SECTION HOOK호출 영역
  const { data: countryCounts } = useGetTeamCountByCountrySuspense();
  //!SECTION HOOK호출 영역

  //SECTION 상태값 영역
  const bars = groupTopCountries(countryCounts);
  //!SECTION 상태값 영역

  return (
    <AdminTeamCountryCountWrapper summary={<span className="text-yds-c1m text-primary-100/70">팀 많은 순</span>}>
      {countryCounts.length === 0 ? (
        <p className="text-yds-c1m text-primary-100/60 flex h-full items-center justify-center">
          등록된 팀이 없습니다.
        </p>
      ) : (
        <div className="h-full w-full" data-testid="admin-team-country-count-chart">
          <AdminTeamCountryCountChart bars={bars} />
        </div>
      )}
    </AdminTeamCountryCountWrapper>
  );
};

export default AdminTeamCountryCount;
