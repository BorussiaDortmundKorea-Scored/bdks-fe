import { supabase } from "@shared/api/config/supabaseClient";
import { type ApiResponse, type PostgrestError } from "@shared/api/types/api-types";
import {
  type ITransferEntity,
  type TransferDirection,
  type TransferReaction,
  type TransferType,
} from "@shared/types/entities/transfer.entity";

// 조회 뷰: transfers 로우 + players·teams join + 반응 집계 (IMatch 패턴)
export type ITransfer = ITransferEntity & {
  player_name: string;
  player_korean_name: string | null;
  head_profile_image_url: string | null;
  full_profile_image_url: string | null;
  counterpart_club_name: string | null;
  counterpart_logo_image_url: string | null;
  like_count: number;
  dislike_count: number;
  my_reaction: TransferReaction | null;
};

export interface ICreateTransferRequest {
  player_id: string;
  direction: TransferDirection;
  transfer_type: TransferType;
  counterpart_team_id?: string | null;
  transfer_date?: string | null;
  euro_fee?: number | null;
}

export interface IUpdateTransferRequest {
  id: string;
  player_id?: string;
  direction?: TransferDirection;
  transfer_type?: TransferType;
  counterpart_team_id?: string | null;
  transfer_date?: string | null;
  euro_fee?: number | null;
}

// 전체 이적 조회 (이적일 최신순)
export const getTransfers = async (): Promise<ApiResponse<ITransfer[]>> => {
  const { data, error } = (await supabase.rpc("get_transfers")) as {
    data: ITransfer[];
    error: PostgrestError | null;
  };

  return { data: data as ITransfer[], error: error as PostgrestError };
};

// 이적 등록
export const createTransfer = async (
  transfer: ICreateTransferRequest,
): Promise<ApiResponse<ITransferEntity>> => {
  const { data, error } = (await supabase.rpc("insert_transfer", {
    p_player_id: transfer.player_id,
    p_direction: transfer.direction,
    p_transfer_type: transfer.transfer_type,
    p_counterpart_team_id: transfer.counterpart_team_id ?? null,
    p_transfer_date: transfer.transfer_date ?? null,
    p_euro_fee: transfer.euro_fee ?? null,
  })) as { data: ITransferEntity; error: PostgrestError | null };

  return { data: data as ITransferEntity, error: error as PostgrestError };
};

// 이적 수정 (부분 업데이트 — 넘긴 값만 반영)
export const updateTransfer = async (
  transfer: IUpdateTransferRequest,
): Promise<ApiResponse<ITransferEntity>> => {
  const { data, error } = (await supabase.rpc("update_transfer", {
    p_id: transfer.id,
    p_player_id: transfer.player_id,
    p_direction: transfer.direction,
    p_transfer_type: transfer.transfer_type,
    p_counterpart_team_id: transfer.counterpart_team_id,
    p_transfer_date: transfer.transfer_date,
    p_euro_fee: transfer.euro_fee,
  })) as { data: ITransferEntity; error: PostgrestError | null };

  return { data: data as ITransferEntity, error: error as PostgrestError };
};

// 이적 삭제
export const deleteTransfer = async (id: string): Promise<ApiResponse<boolean>> => {
  const { data, error } = (await supabase.rpc("delete_transfer", {
    p_id: id,
  })) as { data: boolean; error: PostgrestError | null };

  return { data: data as boolean, error: error as PostgrestError };
};
