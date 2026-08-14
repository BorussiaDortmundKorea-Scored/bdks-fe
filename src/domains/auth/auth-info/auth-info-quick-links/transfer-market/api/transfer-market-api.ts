import { supabase } from "@shared/api/config/supabaseClient";
import { type ApiResponse, type PostgrestError } from "@shared/api/types/api-types";
import {
  type TransferDirection,
  type TransferReaction,
  type TransferType,
} from "@shared/types/entities/transfer.entity";

// get_transfers 조회 결과 (공개 화면용) — A안: 이 기능 폴더에 co-locate
export interface ITransferMarketItem {
  id: string;
  player_id: string;
  player_name: string;
  player_korean_name: string | null;
  head_profile_image_url: string | null;
  full_profile_image_url: string | null;
  direction: TransferDirection;
  transfer_type: TransferType;
  counterpart_team_id: string | null;
  counterpart_club_name: string | null;
  counterpart_logo_image_url: string | null;
  transfer_date: string | null;
  euro_fee: number | null;
  like_count: number;
  dislike_count: number;
  my_reaction: TransferReaction | null;
}

export interface ITransferReactionResult {
  like_count: number;
  dislike_count: number;
  my_reaction: TransferReaction | null;
}

// 전체 이적 조회 (이적일 최신순)
export const getTransfers = async (): Promise<ApiResponse<ITransferMarketItem[]>> => {
  const { data, error } = (await supabase.rpc("get_transfers")) as {
    data: ITransferMarketItem[];
    error: PostgrestError | null;
  };

  return { data: data as ITransferMarketItem[], error: error as PostgrestError };
};

// 좋아요/싫어요 토글 (없으면 추가 / 같은 거 재클릭 취소 / 반대면 전환)
export const toggleTransferReaction = async (
  transferId: string,
  reaction: TransferReaction,
): Promise<ApiResponse<ITransferReactionResult>> => {
  const { data, error } = (await supabase.rpc("toggle_transfer_reaction", {
    p_transfer_id: transferId,
    p_reaction: reaction,
  })) as { data: ITransferReactionResult[] | null; error: PostgrestError | null };

  const row = data?.[0] ?? { like_count: 0, dislike_count: 0, my_reaction: null };
  return { data: row, error: error as PostgrestError };
};
