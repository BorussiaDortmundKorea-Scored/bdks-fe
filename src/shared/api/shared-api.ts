// import { axiosPublic } from "@shared/api/config/axiosPublic";
import { supabase } from "@shared/api/config/supabaseClient";
// axios가 필요없다. why? supabase rls정책과 rpc를 쓰면 알아서 권한체크 가능함
// export const getRotatingPlayerList = async () => {
//   const response = await axiosPublic.get("/player/rotating");
//   return response.data;
// };

export interface IRotatePlayerStatAccumulated {
  korean_name: string;
  overall_avg_rating: number | null;
}

export const getRotatePlayerStatAccumulated = async () => {
  const { data, error } = await supabase.rpc("get_all_players_ratings");

  if (error) {
    throw new Error(`Failed to fetch player ratings: ${error.message}`);
  }

  return data as IRotatePlayerStatAccumulated[];
};
