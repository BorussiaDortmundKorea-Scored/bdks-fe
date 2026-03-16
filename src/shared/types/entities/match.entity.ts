export interface IMatchEntity {
  id: string
  competition_id: string | null
  opponent_team_id: string | null
  match_date: string
  home_away: string | null
  our_score: number | null
  opponent_score: number | null
  formation: string | null
  is_live: boolean | null
  round_name: string | null
  match_start_time: string | null
  second_half_start_time: string | null
  first_half_end_time: string | null
  second_half_end_time: string | null
  created_at: string | null
  updated_at: string | null
}
