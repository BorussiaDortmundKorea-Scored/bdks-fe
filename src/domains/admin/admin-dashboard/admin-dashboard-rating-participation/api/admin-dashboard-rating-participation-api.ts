import { callRpc } from "@shared/api/call-rpc";
import { supabase } from "@shared/api/config/supabaseClient";
import { type ApiResponse } from "@shared/api/types/api-types";

export interface IRatingParticipation {
  total_users: number;
  rated_users: number;
  participation_rate: number;
}

export const getRatingParticipation = async (): Promise<ApiResponse<IRatingParticipation>> =>
  callRpc<IRatingParticipation>(() => supabase.rpc("get_rating_participation_rate"));
