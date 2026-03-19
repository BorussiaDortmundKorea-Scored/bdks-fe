export interface IPointTransactionEntity {
  id: number
  user_id: string
  amount: number
  reason: string
  reference_id: string | null
  created_at: string
}
