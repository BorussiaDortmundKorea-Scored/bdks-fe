export interface IPlayerEntity {
  id: string
  name: string
  korean_name: string | null
  jersey_number: number | null
  nationality: string | null
  full_profile_image_url: string | null
  head_profile_image_url: string | null
  is_current_squad: boolean // 현재 도르트문트 스쿼드 소속 여부 (이적 OUT 시 false)
  created_at: string | null
  updated_at: string | null
}