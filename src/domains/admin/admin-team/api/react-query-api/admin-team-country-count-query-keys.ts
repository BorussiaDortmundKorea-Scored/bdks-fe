/**
 * 작성자: KYD
 * 기능: 국가별 팀 수 React Query 키
 * 프로세스 설명: 팀 목록 키(ALL_TEAMS)의 하위 키로 둔다. 팀 추가·수정·삭제 훅이 [ALL_TEAMS] 로 무효화하면
 *              앞부분이 같은 이 키도 함께 무효화되어 차트가 따로 손대지 않아도 갱신된다.
 */
import { ADMIN_TEAM_QUERY_KEYS } from "@admin/admin-team/api/react-query-api/admin-team-query-keys";

export const ADMIN_TEAM_COUNTRY_COUNT_QUERY_KEY = [ADMIN_TEAM_QUERY_KEYS.ALL_TEAMS, "count-by-country"] as const;
