import { supabase } from "@shared/api/config/supabaseClient";
import { type ApiResponse, type PostgrestError } from "@shared/api/types/api-types";

export interface IUserLoginTypeCountItem {
  provider: string;
  count: number;
}

export const getUserLoginTypeCounts = async (): Promise<ApiResponse<IUserLoginTypeCountItem[]>> => {
  const { data, error } = (await supabase.rpc("get_user_login_type_counts")) as {
    data: IUserLoginTypeCountItem[] | null;
    error: PostgrestError | null;
  };
  return {
    data: (data ?? []) as IUserLoginTypeCountItem[],
    error: error as PostgrestError,
  };
};
