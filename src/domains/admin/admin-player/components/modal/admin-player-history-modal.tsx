/**
 * 작성자: KYD
 * 기능: 선수 이적·은퇴 이력 모달
 * 프로세스 설명: 전체 이적 목록에서 해당 선수 것만 골라 최신순 타임라인으로 보여준다.
 *              방향(영입/방출)·유형(완전/임대/은퇴)은 Chips, 상대 클럽·이적금액은 은퇴가 아닐 때만 표시한다.
 */
import { useMemo } from "react";

import { Button, Chips } from "@youngduck/yd-ui";
import { History } from "lucide-react";

import type { IPlayer } from "@admin/admin-player/api/admin-player-api";
import { useGetAllTransfersSuspense } from "@admin/admin-transfer/api/react-query-api/use-get-transfers-by-season-suspense";
import { directionText, isRetiredType, typeText } from "@admin/admin-transfer/constants/transfer-options";

import ModalFooter from "@shared/components/modal/modal-footer";
import ModalTitle from "@shared/components/modal/modal-title";
import { formatEuroToMillion } from "@shared/utils/euro-utils";

interface IAdminPlayerHistoryModalProps {
  player: IPlayer;
  onClose: () => void;
}

/** 이적일 최신순, 날짜 미등록은 맨 뒤 */
const compareByDateDesc = (a: string | null, b: string | null) => {
  if (a === b) return 0;
  if (a === null) return 1;
  if (b === null) return -1;
  return b.localeCompare(a);
};

export function AdminPlayerHistoryModal({ player, onClose }: IAdminPlayerHistoryModalProps) {
  //SECTION HOOK호출 영역
  const { data } = useGetAllTransfersSuspense();
  const history = useMemo(
    () =>
      data
        .filter((transfer) => transfer.player_id === player.id)
        .sort(
          (a, b) =>
            compareByDateDesc(a.transfer_date, b.transfer_date) || compareByDateDesc(a.created_at, b.created_at),
        ),
    [data, player.id],
  );
  //!SECTION HOOK호출 영역

  return (
    <div className="flex flex-col gap-4">
      <ModalTitle>{player.korean_name ?? player.name} 이적·은퇴 이력</ModalTitle>

      {history.length === 0 ? (
        <div className="flex flex-col items-center gap-2 py-10 text-center">
          <History size={32} className="text-primary-100/40" />
          <p className="text-yds-b2 text-primary-100/60">등록된 이력이 없습니다.</p>
        </div>
      ) : (
        <ol className="flex flex-col">
          {history.map((transfer) => {
            const isRetired = isRetiredType(transfer.transfer_type);
            return (
              <li
                key={transfer.id}
                className="border-primary-100/10 flex gap-4 border-b py-3 first:pt-0 last:border-b-0 last:pb-0"
              >
                <span className="text-yds-c1m text-primary-100/60 w-[88px] shrink-0 pt-1">
                  {transfer.transfer_date ?? "날짜 미등록"}
                </span>
                <div className="flex min-w-0 flex-1 flex-col gap-2">
                  <div className="flex items-center gap-2">
                    <Chips variant={isRetired ? "fill" : "outlined"} color="primary">
                      {typeText(transfer.transfer_type)}
                    </Chips>
                    {!isRetired && (
                      <Chips variant={transfer.direction === "IN" ? "fill" : "outlined"} color="primary">
                        {directionText(transfer.direction)}
                      </Chips>
                    )}
                  </div>
                  {!isRetired && (
                    <p className="text-yds-b2 text-primary-100 truncate">
                      {transfer.counterpart_club_name ?? "상대 클럽 미등록"}
                      <span className="text-primary-100/60"> · {formatEuroToMillion(transfer.euro_fee)}</span>
                    </p>
                  )}
                </div>
              </li>
            );
          })}
        </ol>
      )}

      <ModalFooter>
        <Button variant="outlined" color="primary" size="full" onClick={onClose}>
          닫기
        </Button>
      </ModalFooter>
    </div>
  );
}
