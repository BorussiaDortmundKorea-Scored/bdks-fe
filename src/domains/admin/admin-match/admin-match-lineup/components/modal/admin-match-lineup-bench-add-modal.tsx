/**
 * 작성자: KYD
 * 기능: 후보 선수 추가 모달 (여러 명 선택)
 * 프로세스 설명: 보드 "교체" 화면의 후보 + 칸을 누르면 열린다. 선발은 보드 자리에서 한 명씩 넣고,
 *              후보는 보통 7~9명을 한꺼번에 넣으므로 체크박스로 여러 명을 고른 뒤 한 번에 추가한다.
 *              이미 이 경기 명단에 있는 선수와 이적한 선수는 목록에서 뺀다. 이름으로 좁혀 볼 수 있다.
 *              지난 경기를 정리할 때처럼 이적한 선수가 필요하면 "이적한 선수도 보기" 로 함께 본다.
 */
import { useMemo, useState } from "react";

import { Button, CheckBox, Input } from "@youngduck/yd-ui";

import { useAddMatchBenchPlayers } from "@admin/admin-match/admin-match-lineup/api/react-query-api/use-add-match-bench-players";
import { useGetAllPlayersSuspense } from "@admin/admin-match/admin-match-lineup/api/react-query-api/use-get-all-players-suspense";
import { useGetMatchLineupsSuspense } from "@admin/admin-match/admin-match-lineup/api/react-query-api/use-get-match-lineups-suspense";
import {
  filterSquadPlayers,
  isDepartedPlayer,
  useLineupPlayerOptions,
} from "@admin/admin-match/admin-match-lineup/hooks/use-lineup-player-options";
import { isUnusedBench } from "@admin/admin-match/admin-match-lineup/utils/lineup-board-utils";

import ModalFooter from "@shared/components/modal/modal-footer";
import ModalTitle from "@shared/components/modal/modal-title";

interface IAdminMatchLineupBenchAddModalProps {
  matchId: string;
  onClose: () => void;
}

export const AdminMatchLineupBenchAddModal = ({ matchId, onClose }: IAdminMatchLineupBenchAddModalProps) => {
  //SECTION HOOK호출 영역
  const { data: players } = useGetAllPlayersSuspense();
  const { data: lineups } = useGetMatchLineupsSuspense(matchId);
  const { mutateAsync: addBenchPlayers, isPending: isAdding } = useAddMatchBenchPlayers(matchId);
  //!SECTION HOOK호출 영역

  //SECTION 상태값 영역
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedIds, setSelectedIds] = useState<Set<string>>(() => new Set());
  const [includeDeparted, setIncludeDeparted] = useState(false);

  // 이적한 선수는 기본으로 빼고, 이미 이 경기 명단에 있는 선수도 뺀다 (label = 선수 id, value = 화면 표시명)
  const squadPlayers = useMemo(() => filterSquadPlayers(players, includeDeparted), [players, includeDeparted]);
  const playerOptions = useLineupPlayerOptions(squadPlayers, lineups);
  const hasDepartedPlayers = players.some(isDepartedPlayer);
  const visibleOptions = playerOptions.filter((option) =>
    option.value.toLowerCase().includes(searchTerm.trim().toLowerCase()),
  );
  const benchCount = lineups.filter(isUnusedBench).length;
  //!SECTION 상태값 영역

  //SECTION 메서드 영역
  const toggleSelected = (playerId: string, checked: boolean) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (checked) next.add(playerId);
      else next.delete(playerId);
      return next;
    });
  };

  const handleAdd = async () => {
    if (selectedIds.size === 0) return;
    await addBenchPlayers({ match_id: matchId, player_ids: [...selectedIds] });
    onClose();
  };
  //!SECTION 메서드 영역

  return (
    <div className="flex flex-col gap-4">
      <ModalTitle>후보 선수 추가</ModalTitle>
      <p className="text-yds-c1m text-white/70">현재 후보 {benchCount}명</p>

      <Input
        variant="search"
        size="full"
        value={searchTerm}
        onChange={(event: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(event.target.value)}
        placeholder="이름으로 찾기"
        aria-label="이름으로 찾기"
      />
      {hasDepartedPlayers && (
        <CheckBox
          checked={includeDeparted}
          onCheckedChange={setIncludeDeparted}
          value="이적한 선수도 보기"
          shape="square"
        />
      )}

      <div className="flex flex-col gap-1" role="group" aria-label="추가할 선수">
        {visibleOptions.length === 0 ? (
          <p className="text-yds-c1r py-6 text-center text-white/50">
            {playerOptions.length === 0 ? "모든 선수가 이미 명단에 있어요" : "찾는 선수가 없어요"}
          </p>
        ) : (
          visibleOptions.map((option) => (
            <div key={option.label} className="hover:bg-primary-100/10 rounded px-2 py-1.5 transition-colors">
              <CheckBox
                checked={selectedIds.has(option.label)}
                onCheckedChange={(checked) => toggleSelected(option.label, checked)}
                value={option.value}
                shape="square"
              />
            </div>
          ))
        )}
      </div>

      <ModalFooter>
        <Button variant="outlined" color="primary" size="full" onClick={onClose}>
          닫기
        </Button>
        <Button
          variant="fill"
          color="primary"
          size="full"
          onClick={handleAdd}
          disabled={selectedIds.size === 0 || isAdding}
        >
          {isAdding ? "추가 중..." : selectedIds.size > 0 ? `${selectedIds.size}명 추가` : "추가"}
        </Button>
      </ModalFooter>
    </div>
  );
};
