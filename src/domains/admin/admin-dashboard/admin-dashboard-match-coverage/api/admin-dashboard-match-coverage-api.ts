import { supabase } from "@shared/api/config/supabaseClient";
import { type ApiResponse, type PostgrestError } from "@shared/api/types/api-types";

export interface IMatchCoverageItem {
  match_id: string;
  opponent_name: string;
  match_date: string;
  participant_count: number;
  total_users: number;
  coverage_percent: number;
}

export const getMatchParticipationCoverage = async (): Promise<ApiResponse<IMatchCoverageItem[]>> => {
  const { data, error } = (await supabase.rpc("get_match_participation_coverage", { limit_count: 10 })) as {
    data: IMatchCoverageItem[] | null;
    error: PostgrestError | null;
  };
  return {
    data: (data ?? []) as IMatchCoverageItem[],
    error: error as PostgrestError,
  };
};
