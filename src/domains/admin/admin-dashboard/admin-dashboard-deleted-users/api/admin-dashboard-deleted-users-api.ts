import { supabase } from "@shared/api/config/supabaseClient";
import { type ApiResponse, type PostgrestError } from "@shared/api/types/api-types";

interface IDeletedUsersStats {
  total_deleted: number;
  this_month_deleted: number;
}

export const getDeletedUsersStats = async (): Promise<ApiResponse<IDeletedUsersStats>> => {
  const { data, error } = (await supabase.rpc("get_deleted_users_stats")) as {
    data: IDeletedUsersStats;
    error: PostgrestError | null;
  };
  return {
    data: data as IDeletedUsersStats,
    error: error as PostgrestError,
  };
};
