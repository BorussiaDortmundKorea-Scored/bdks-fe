/**
 * 작성자: KYD
 * 기능: 경기 일괄 추가 모달 컴포넌트
 * 프로세스 설명: 여러 경기를 한 번에 등록. 각 행은 BulkAddRow 컴포넌트로 분리하여 hook 관리
 */
import { useCallback, useRef, useState } from "react";

import { Button, Input } from "@youngduck/yd-ui";
import { useOverlay } from "@youngduck/yd-ui/Overlays";

import { useGetAllCompetitionsSuspense } from "@admin/admin-competition/api/react-query-api/use-get-all-competitions-suspense";
import { useBulkCreateMatches } from "@admin/admin-match/api/react-query-api/use-bulk-create-matches";
import AdminMatchBulkAddRow, {
  type IBulkAddRowHooks,
} from "@admin/admin-match/components/modal/admin-match-bulk-add-row";
import { convertLocalToUTC, extractKSTDateFromLocal } from "@admin/admin-match/utils/datetime-utils";
import { useGetAllTeamsSuspense } from "@admin/admin-team/api/react-query-api/use-get-all-teams-suspense";

interface IAdminMatchBulkAddModalProps {
  onClose: () => void;
}

interface IBulkMatchRowState {
  match_start_time: string;
  round_name: string;
}

const MAX_MATCH_COUNT = 10;

export const AdminMatchBulkAddModal = ({ onClose }: IAdminMatchBulkAddModalProps) => {
  //SECTION HOOK 호출
  const { data: competitions } = useGetAllCompetitionsSuspense();
  const { data: teams } = useGetAllTeamsSuspense();
  const { mutateAsync: bulkCreateMatches, isPending: isCreating } = useBulkCreateMatches();
  const { toast } = useOverlay();
  //!SECTION HOOK 호출

  //SECTION 상태값
  const [matchCount, setMatchCount] = useState<number>(5);
  const [rows, setRows] = useState<IBulkMatchRowState[]>(
    Array.from({ length: 5 }, () => ({
      match_start_time: "",
      round_name: "",
    })),
  );

  const rowHooksRef = useRef<Map<number, IBulkAddRowHooks>>(new Map());
  //!SECTION 상태값

  //SECTION SelectBox 옵션
  const competitionOptions = competitions.map((c) => ({
    label: c.id,
    value: `${c.name} (${c.season})`,
  }));

  const teamOptions = teams.map((t) => ({ label: t.id, value: t.name }));
  //!SECTION SelectBox 옵션

  //SECTION 메서드
  const createEmptyRow = (): IBulkMatchRowState => ({
    match_start_time: "",
    round_name: "",
  });

  const handleChangeMatchCount = (value: string) => {
    const parsed = Number.parseInt(value, 10);

    if (Number.isNaN(parsed) || parsed <= 0) {
      setMatchCount(1);
      setRows((prev) => Array.from({ length: 1 }, (_, index) => prev[index] ?? createEmptyRow()));
      return;
    }

    const safeValue = Math.min(parsed, MAX_MATCH_COUNT);

    setMatchCount(safeValue);
    setRows((prev) => Array.from({ length: safeValue }, (_, index) => prev[index] ?? createEmptyRow()));
  };

  const handleRowChange = useCallback((rowIndex: number, key: keyof IBulkMatchRowState, value: string) => {
    setRows((prev) => {
      const next = [...prev];
      next[rowIndex] = { ...next[rowIndex], [key]: value };
      return next;
    });
  }, []);

  const handleHooksReady = useCallback((index: number, hooks: IBulkAddRowHooks) => {
    rowHooksRef.current.set(index, hooks);
  }, []);

  const handleSubmit = async () => {
    const trimmedRows = rows.slice(0, matchCount);

    const payload = trimmedRows
      .map((row, index) => {
        const hooks = rowHooksRef.current.get(index);
        if (!hooks) return null;

        const competitionId = hooks.competitionLabel;
        const opponentTeamId = hooks.teamLabel;
        const homeAway = hooks.homeAwayLabel as "HOME" | "AWAY";

        if (!competitionId || !opponentTeamId || !row.match_start_time) {
          return null;
        }

        return {
          competition_id: competitionId,
          opponent_team_id: opponentTeamId,
          match_date: extractKSTDateFromLocal(row.match_start_time),
          home_away: homeAway,
          match_start_time: convertLocalToUTC(row.match_start_time),
          round_name: row.round_name || undefined,
        };
      })
      .filter((item) => item !== null);

    if (payload.length === 0) {
      toast({ content: "최소 1경기 이상 필수 값(대회, 상대팀, 경기 시작 시간)을 채워주세요." });
      return;
    }

    await bulkCreateMatches({ matches: payload });
    handleClose();
  };

  const handleClose = () => {
    setMatchCount(5);
    setRows(
      Array.from({ length: 5 }, () => ({
        match_start_time: "",
        round_name: "",
      })),
    );
    rowHooksRef.current.clear();
    onClose();
  };
  //!SECTION 메서드

  return (
    <div className="flex max-h-[80vh] flex-col gap-4">
      <h2 className="text-yds-b1 text-primary-100">경기 일괄 추가</h2>

      <div className="flex items-center gap-2">
        <span className="text-yds-b2 text-primary-100">경기 개수</span>
        <Input
          type="number"
          min={1}
          max={MAX_MATCH_COUNT}
          value={matchCount}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => handleChangeMatchCount(event.target.value)}
          size="sm"
          color="primary-100"
          className="w-24"
        />
        <span className="text-yds-b3 text-white">(최대 {MAX_MATCH_COUNT}경기까지 한 번에 등록할 수 있어요)</span>
      </div>

      <div className="scrollbar-thin mt-2 flex max-h-[55vh] flex-col gap-4 overflow-y-auto pr-2">
        {rows.slice(0, matchCount).map((row, index) => (
          <AdminMatchBulkAddRow
            key={index}
            index={index}
            row={row}
            competitionOptions={competitionOptions}
            teamOptions={teamOptions}
            onRowChange={handleRowChange}
            onHooksReady={handleHooksReady}
          />
        ))}
      </div>

      <div className="mt-4 flex gap-2">
        <Button variant="outlined" color="primary" size="full" onClick={handleClose}>
          취소
        </Button>
        <Button variant="fill" color="primary" size="full" onClick={handleSubmit} disabled={isCreating}>
          {isCreating ? "대량 추가 중..." : "대량 추가"}
        </Button>
      </div>
    </div>
  );
};
