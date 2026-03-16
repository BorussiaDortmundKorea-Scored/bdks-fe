import { supabase } from "@shared/api/config/supabaseClient";
import { type ApiResponse, type PostgrestError } from "@shared/api/types/api-types";
import { type IPlayerEntity } from "@shared/types/entities/player.entity";

export type IPlayer = IPlayerEntity;

export type ICreatePlayerRequest =
  Pick<IPlayerEntity, "name"> &
  Partial<Omit<IPlayerEntity, "id" | "name" | "created_at" | "updated_at">>;

export type IUpdatePlayerRequest =
  Pick<IPlayerEntity, "id"> &
  Partial<Omit<IPlayerEntity, "id" | "created_at" | "updated_at">>;

// 모든 선수 조회
export const getAllPlayers = async (): Promise<ApiResponse<IPlayer[]>> => {
  const { data, error } = (await supabase.rpc("get_all_players")) as { data: IPlayer[]; error: PostgrestError | null };
  return { data: data as IPlayer[], error: error as PostgrestError };
};
// 선수 생성
export const createPlayer = async (player: ICreatePlayerRequest): Promise<ApiResponse<IPlayer>> => {
  const { data, error } = (await supabase.rpc("insert_player", {
    player_name: player.name,
    player_korean_name: player.korean_name,
    player_jersey_number: player.jersey_number,
    player_nationality: player.nationality,
    player_full_profile_image_url: player.full_profile_image_url,
    player_head_profile_image_url: player.head_profile_image_url,
  })) as { data: IPlayer; error: PostgrestError | null };

  return {
    data: data as IPlayer,
    error: error as PostgrestError,
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
    data: data as IPlayer,
    error: error as PostgrestError,
  };
};

// 선수 삭제
export const deletePlayer = async (id: string): Promise<ApiResponse<boolean>> => {
  const { data, error } = (await supabase.rpc("delete_player", {
    player_id: id,
  })) as { data: boolean; error: PostgrestError | null };

  return { data: data as boolean, error: error as PostgrestError };
};
