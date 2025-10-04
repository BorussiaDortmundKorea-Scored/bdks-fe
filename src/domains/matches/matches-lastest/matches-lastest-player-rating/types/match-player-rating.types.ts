// 도메인 엔티티 타입들
export interface IMatchPlayerRating {
  korean_name: string;
  full_profile_image_url: string;
  position_detail_name: string;
  line_number: number;
  avg_rating: number;
  rating_count: number;
  lineup_type: string;
  player_id: string;
  match_id: string;
  round_name: string;
  league_name: string;
  season: string;
  opponent_team_name: string;
  goals: number;
  assists: number;
  match_start_time: Date;
  first_half_end_time: Date;
  second_half_start_time: Date;
  second_half_end_time: Date;
}

export interface IUserRating {
  id: string;
  minute: string; // "45+3" 형태로 추가시간 표현
  rating: number;
  comment: string | null;
  created_at: string;
  updated_at: string;
}

// 사용자의 모든 평점들 인터페이스
export interface IUserPlayerRatings {
  ratings: IUserRating[];
  total_count: number;
}
