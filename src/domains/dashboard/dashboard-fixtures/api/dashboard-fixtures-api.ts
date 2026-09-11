/**
 * 작성자: KYD
 * 기능: 다가오는 경기 일정 조회 API (RPC 사용)
 * 프로세스 설명: get_upcoming_matches RPC로 오늘(KST) 이후 예정된 경기를 날짜 오름차순으로 조회하고,
 *              get_all_teams 로 상대팀 로고(logo_image_url)를 이름 기준으로 병합한다.
 *              (get_viewing_matches 와 동일하게 각 경기가 opponent_team_logo_image_url 을 갖도록 맞춘다)
 */
import { callRpc } from "@shared/api/call-rpc";
import { supabase } from "@shared/api/config/supabaseClient";
import { type ApiResponse } from "@shared/api/types/api-types";
import { type ITeamEntity } from "@shared/types/entities/team.entity";

export interface IUpcomingMatch {
  id: string;
  match_date: string;
  /** 킥오프 시각(UTC ISO). 아직 확정되지 않은 경기가 많아 null 이 흔하다. */
  match_start_time: string | null;
  text_home_away: "HOME" | "AWAY";
  round_name: string | null;
  season: string;
  league_name: string;
  opponent_name: string;
  /** 상대팀 로고 (get_all_teams 에서 이름 매핑, 미등록 팀이면 null) */
  opponent_team_logo_image_url: string | null;
}

// get_upcoming_matches RPC 원본 응답 (로고 미포함)
type UpcomingMatchRow = Omit<IUpcomingMatch, "opponent_team_logo_image_url">;

export const getUpcomingMatches = async (limitCount = 5): Promise<ApiResponse<IUpcomingMatch[]>> => {
  const matchesRes = await callRpc<UpcomingMatchRow[]>(() =>
    supabase.rpc("get_upcoming_matches", { limit_count: limitCount }),
  );
  if (matchesRes.error || !matchesRes.data) {
    return { data: matchesRes.data as unknown as IUpcomingMatch[], error: matchesRes.error };
  }

  // 상대팀 로고 매핑 (팀명 기준). 로고 조회 실패 시에도 경기 목록은 그대로 반환한다.
  const teamsRes = await callRpc<Pick<ITeamEntity, "name" | "logo_image_url">[]>(() => supabase.rpc("get_all_teams"));
  const logoByName = new Map((teamsRes.data ?? []).map((team) => [team.name, team.logo_image_url] as const));

  const data = matchesRes.data.map((match) => ({
    ...match,
    opponent_team_logo_image_url: logoByName.get(match.opponent_name) ?? null,
  }));

  return { data, error: null };
};
