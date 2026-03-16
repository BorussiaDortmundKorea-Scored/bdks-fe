export interface IRatingEntity {
  id: number
  user_id: string
  match_id: string
  player_id: string
  minute: string
  rating: number
  comment: string | null
  created_at: string | null
  updated_at: string | null
}
