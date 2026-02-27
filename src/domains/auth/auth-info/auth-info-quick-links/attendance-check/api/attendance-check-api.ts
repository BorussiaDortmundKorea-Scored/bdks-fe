import { supabase } from "@shared/api/config/supabaseClient";
import { type ApiResponse, type PostgrestError } from "@shared/api/types/api-types";

export type AttendanceMatchStatus = "PAST" | "TODAY" | "UPCOMING";

export interface IAttendanceMatch {
  id: string;
  match_date: string;
  home_away: "HOME" | "AWAY";
  round_name: string | null;
  competition_name: string;
  season: string;
  opponent_team_name: string;
  opponent_team_logo_image_url: string | null;
  is_live: boolean;
  status: AttendanceMatchStatus;
}

export const getAttendanceMatches = async (): Promise<ApiResponse<IAttendanceMatch[]>> => {
  const { data, error } = (await supabase.rpc("get_attendance_matches")) as {
    data: IAttendanceMatch[];
    error: PostgrestError | null;
  };

  return { data: data as IAttendanceMatch[], error: error as PostgrestError };
};

