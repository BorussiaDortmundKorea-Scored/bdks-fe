/**
 * 작성자: KYD
 * 기능: 선택 가능한 대회 목록 조회 훅 (경기 추가/일괄추가 모달의 대회 드롭다운용)
 * 프로세스 설명: get_active_competitions RPC가 competition_types.is_active · seasons.is_active를
 *              모두 만족하는 대회만 최신 시즌순으로 내려준다. 전체 목록이 필요한
 *              대회 관리 화면/경기 수정 모달은 useGetAllCompetitionsSuspense를 사용한다.
 */
import { useSuspenseQuery } from "@tanstack/react-query";

import { getActiveCompetitions } from "@admin/admin-competition/api/admin-competition-api";
import { ADMIN_COMPETITION_QUERY_KEYS } from "@admin/admin-competition/api/react-query-api/admin-competition-query-keys";

import { handleSupabaseApiResponse } from "@shared/utils/sentry-utils";

export function useGetActiveCompetitionsSuspense() {
  const query = useSuspenseQuery({
    queryKey: [ADMIN_COMPETITION_QUERY_KEYS.ACTIVE_COMPETITIONS],
    queryFn: async () => {
      const response = await getActiveCompetitions();
      return handleSupabaseApiResponse(response);
    },
  });

  const { data } = query;

  return { data };
}
