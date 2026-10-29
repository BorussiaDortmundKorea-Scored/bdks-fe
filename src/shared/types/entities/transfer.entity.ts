export type TransferDirection = "IN" | "OUT";
export type TransferType = "PERMANENT" | "LOAN" | "RETIRED"; // 완전이적 / 임대 / 은퇴
export type TransferReaction = "LIKE" | "DISLIKE"; // 좋아요 / 싫어요

/**
 * transfers 테이블 로우 (이적 이벤트)
 * - direction(IN/OUT) × transfer_type(PERMANENT/LOAN/RETIRED)
 * - RETIRED 는 항상 OUT 이고 상대 클럽·이적금액이 없다 (DB CHECK 로 강제)
 * - counterpart_team_id: 상대 클럽(IN=원소속 / OUT=행선지). 자유계약·유스·은퇴는 null
 * - euro_fee: 이적금액(순수 유로 정수). 비공개·자유계약·은퇴는 null
 *
 * ※ players·teams join + 반응 집계가 붙은 조회 뷰 타입(ITransfer)은
 *   api 레이어에서 `ITransferEntity & { ... }` 로 정의한다.
 */
export interface ITransferEntity {
  id: string;
  player_id: string;
  direction: TransferDirection;
  transfer_type: TransferType;
  counterpart_team_id: string | null;
  transfer_date: string | null;
  euro_fee: number | null;
  created_at: string | null;
}
