import { supabase } from "@shared/api/config/supabaseClient";
import { type ApiResponse, type PostgrestError } from "@shared/api/types/api-types";

interface IUserTotalAndPct {
  total_users: number;
  monthly_growth_percent: number;
}

export const getUserTotalAndMonthlyPercent = async (): Promise<ApiResponse<IUserTotalAndPct>> => {
  const { data, error } = (await supabase.rpc("get_user_total_and_monthly_percent")) as {
    data: IUserTotalAndPct;
    error: PostgrestError | null;
  };
  return {
    data: data as IUserTotalAndPct,
    error: error as PostgrestError,
  };
};
