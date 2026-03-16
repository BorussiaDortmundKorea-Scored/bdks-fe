import { type LineupType, type SubstitutionStatus } from "@shared/types/match-lineup.types";

export interface IMatchLineupEntity {
  id: number
  match_id: string
  player_id: string
  position_id: string | null
  lineup_type: LineupType
  is_captain: boolean | null
  substitution_status: SubstitutionStatus | null
  substitution_minute: number | null
  substitution_partner_id: string | null
  yellow_cards: number | null
  red_card_minute: number | null
  is_sent_off: boolean | null
  goals: number | null
  assists: number | null
  created_at: string | null
  updated_at: string | null
}
