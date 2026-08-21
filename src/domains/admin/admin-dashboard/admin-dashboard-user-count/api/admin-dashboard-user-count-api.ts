import { callRpc } from "@shared/api/call-rpc";
import { supabase } from "@shared/api/config/supabaseClient";
import { type ApiResponse } from "@shared/api/types/api-types";

interface IUserTotalAndPct {
  total_users: number;
  monthly_growth_percent: number;
}

export const getUserTotalAndMonthlyPercent = async (): Promise<ApiResponse<IUserTotalAndPct>> =>
  callRpc<IUserTotalAndPct>(() => supabase.rpc("get_user_total_and_monthly_percent"));
