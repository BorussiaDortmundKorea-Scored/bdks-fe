import { callRpc } from "@shared/api/call-rpc";
import { supabase } from "@shared/api/config/supabaseClient";
import { type ApiResponse } from "@shared/api/types/api-types";

interface IDeletedUsersStats {
  total_deleted: number;
  this_month_deleted: number;
}

export const getDeletedUsersStats = async (): Promise<ApiResponse<IDeletedUsersStats>> =>
  callRpc<IDeletedUsersStats>(() => supabase.rpc("get_deleted_users_stats"));
