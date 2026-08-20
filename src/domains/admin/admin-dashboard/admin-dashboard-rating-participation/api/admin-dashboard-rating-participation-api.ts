import { supabase } from "@shared/api/config/supabaseClient";
import { type ApiResponse, type PostgrestError } from "@shared/api/types/api-types";

export interface IRatingParticipation {
  total_users: number;
  rated_users: number;
  participation_rate: number;
}

export const getRatingParticipation = async (): Promise<ApiResponse<IRatingParticipation>> => {
  const { data, error } = (await supabase.rpc("get_rating_participation_rate")) as {
    data: IRatingParticipation;
    error: PostgrestError | null;
  };
  return {
    data: data as IRatingParticipation,
    error: error as PostgrestError,
  };
};
