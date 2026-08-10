export interface ICompetitionEntity {
  id: string
  competition_type_id: string
  name: string // competition_types에서 join된 대회명
  name_en: string | null
  season: string
  created_at: string | null
  updated_at: string | null
}

export interface ICompetitionTypeEntity {
  id: string
  name: string
  name_en: string | null
  sort_order: number
}
