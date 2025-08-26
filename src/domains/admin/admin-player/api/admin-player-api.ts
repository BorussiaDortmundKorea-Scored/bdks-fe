import { PostgrestError } from "@supabase/supabase-js";

import { supabase } from "@shared/api/config/supabaseClient";

export interface IPlayer {
  id: string;
  name: string;
  korean_name: string | null;
  jersey_number: number | null;
  nationality: string | null;
  full_profile_image_url: string | null;
  head_profile_image_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface ICreatePlayerRequest {
  name: string;
  korean_name?: string;
  jersey_number?: number;
  nationality?: string;
  full_profile_image_url?: string;
  head_profile_image_url?: string;
}

export interface IUpdatePlayerRequest {
  id: string;
  name?: string;
  korean_name?: string;
  jersey_number?: number;
  nationality?: string;
  full_profile_image_url?: string;
  head_profile_image_url?: string;
}

// API 응답 타입 정의
export interface ApiResponse<T> {
  data: T | null;
  error: PostgrestError | null;
}

// 모든 선수 조회
export const getAllPlayers = async (): Promise<ApiResponse<IPlayer[]>> => {
  const { data, error } = await supabase.rpc("get_all_players");
  return { data, error };
};

// 선수 생성
export const createPlayer = async (player: ICreatePlayerRequest): Promise<ApiResponse<IPlayer>> => {
  const { data, error } = await supabase.rpc("insert_player", {
    player_name: player.name,
    player_korean_name: player.korean_name,
    player_jersey_number: player.jersey_number,
    player_nationality: player.nationality,
    player_full_profile_image_url: player.full_profile_image_url,
    player_head_profile_image_url: player.head_profile_image_url,
  });

  return {
    data: data?.[0] || null,
    error,
  };
};

// 선수 수정
export const updatePlayer = async (player: IUpdatePlayerRequest): Promise<ApiResponse<IPlayer>> => {
  const { data, error } = await supabase.rpc("update_player", {
    p_player_id: player.id,
    p_player_name: player.name,
    p_player_korean_name: player.korean_name,
    p_player_jersey_number: player.jersey_number,
    p_player_nationality: player.nationality,
    p_player_full_profile_image_url: player.full_profile_image_url,
    p_player_head_profile_image_url: player.head_profile_image_url,
  });

  return {
    data: data?.[0] || null,
    error,
  };
};

// 선수 삭제
export const deletePlayer = async (id: string): Promise<ApiResponse<boolean>> => {
  const { data, error } = await supabase.rpc("delete_player", {
    player_id: id,
  });

  return { data, error };
};
