import { axiosAuth } from "../../auth/api/axiosAuth";

export interface IPlayer {
  id: string;
  name: string;
  korean_name: string;
  jersey_number: number;
  position_id: string;
  nationality: string;
  full_profile_image_url: string;
  head_profile_image_url: string;
  positions: {
    sort_order: number;
    position_code: string;
  };
}

export const getPlayers = async () => {
  const response = await axiosAuth.get<IPlayer[]>("/players", {
    params: {
      select:
        "id,name,korean_name,jersey_number,position_id,nationality,full_profile_image_url,head_profile_image_url,positions(position_code,sort_order)", // created_at, updated_at 제외, 필요한 컬럼만 선택
    },
  });
  return response.data;
};
