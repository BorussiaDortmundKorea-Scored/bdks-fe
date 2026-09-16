/**
 * 작성자: KYD
 * 기능: 인기 최애선수 순위 조회 API (RPC get_popular_favorite_players)
 * 프로세스 설명: profiles.favorite_player 를 선수별로 집계해 등록자 수 내림차순으로 반환 (관리자 전용)
 */
import { callRpc } from "@shared/api/call-rpc";
import { supabase } from "@shared/api/config/supabaseClient";
import { type ApiResponse } from "@shared/api/types/api-types";

export interface IPopularFavoritePlayer {
  /** 등록자 수 기준 순위 (동률은 같은 순위) */
  rank_no: number;
  player_id: string;
  /** korean_name 우선, 없으면 name */
  player_name: string;
  jersey_number: number | null;
  head_profile_image_url: string | null;
  is_current_squad: boolean;
  /** 이 선수를 최애선수로 등록한 사용자 수 */
  user_count: number;
  /** 최애선수를 등록한 전체 사용자 대비 비율(%) */
  percentage: number;
}

/** 인기 최애선수 순위 조회 (관리자 전용) */
export const getPopularFavoritePlayers = async (): Promise<ApiResponse<IPopularFavoritePlayer[]>> =>
  callRpc<IPopularFavoritePlayer[]>(() => supabase.rpc("get_popular_favorite_players"));
