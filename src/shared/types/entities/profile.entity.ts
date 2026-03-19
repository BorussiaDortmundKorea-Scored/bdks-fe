export interface IProfileEntity {
  id: string
  nickname: string
  favorite_player: string | null
  is_admin: boolean | null
  points: number
  created_at: string
  updated_at: string
}
