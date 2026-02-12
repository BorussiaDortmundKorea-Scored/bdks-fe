/**
 * 작성자: KYD
 * 기능: 경기 일괄 추가 모달 컴포넌트
 * 프로세스 설명: 여러 경기 정보를 한 번에 입력하여 bulk_insert_matches RPC로 등록
 */
import { useMemo, useState } from "react";

import { Button, Input, SelectBox, useSelectBox } from "@youngduck/yd-ui";

import { useGetAllCompetitionsSuspense } from "@admin/admin-competition/api/react-query-api/use-get-all-competitions-suspense";
import { useBulkCreateMatches } from "@admin/admin-match/api/react-query-api/use-bulk-create-matches";
import { convertLocalToUTC } from "@admin/admin-match/utils/datetime-utils";
import { useGetAllTeamsSuspense } from "@admin/admin-team/api/react-query-api/use-get-all-teams-suspense";

type HomeAwayType = "HOME" | "AWAY";

interface IAdminMatchBulkAddModalProps {
  onClose: () => void;
}

interface IBulkMatchRowState {
  match_date: string;
  home_away: HomeAwayType;
  match_start_time: string;
  round_name: string;
}

const MAX_MATCH_COUNT = 10;

export const AdminMatchBulkAddModal = ({ onClose }: IAdminMatchBulkAddModalProps) => {
  //SECTION HOOK 호출
  const { data: competitions } = useGetAllCompetitionsSuspense();
  const { data: teams } = useGetAllTeamsSuspense();
  const { mutateAsync: bulkCreateMatches, isPending: isCreating } = useBulkCreateMatches();
  //!SECTION HOOK 호출

  //SECTION 상태값
  const [matchCount, setMatchCount] = useState<number>(5);
  const [rows, setRows] = useState<IBulkMatchRowState[]>(
    Array.from({ length: 5 }, () => ({
      match_date: "",
      home_away: "HOME",
      match_start_time: "",
      round_name: "",
    })),
  );
  //!SECTION 상태값

  //SECTION SelectBox 옵션
  const competitionOptions = useMemo(
    () =>
      competitions.map((c) => ({
        label: c.id,
        value: `${c.name} (${c.season})`,
      })),
    [competitions],
  );

  const teamOptions = useMemo(
    () => teams.map((t) => ({ label: t.id, value: t.name })),
    [teams],
  );

  const homeAwayOptions = useMemo(
    () => [
      { label: "HOME", value: "홈" },
      { label: "AWAY", value: "어웨이" },
    ],
    [],
  );
  //!SECTION SelectBox 옵션

  //SECTION SelectBox 훅
  const competitionHook0 = useSelectBox({ options: competitionOptions, search: true });
  const teamHook0 = useSelectBox({ options: teamOptions, search: true });
  const homeAwayHook0 = useSelectBox({ options: homeAwayOptions, defaultValue: "홈" });

  const competitionHook1 = useSelectBox({ options: competitionOptions, search: true });
  const teamHook1 = useSelectBox({ options: teamOptions, search: true });
  const homeAwayHook1 = useSelectBox({ options: homeAwayOptions, defaultValue: "홈" });

  const competitionHook2 = useSelectBox({ options: competitionOptions, search: true });
  const teamHook2 = useSelectBox({ options: teamOptions, search: true });
  const homeAwayHook2 = useSelectBox({ options: homeAwayOptions, defaultValue: "홈" });

  const competitionHook3 = useSelectBox({ options: competitionOptions, search: true });
  const teamHook3 = useSelectBox({ options: teamOptions, search: true });
  const homeAwayHook3 = useSelectBox({ options: homeAwayOptions, defaultValue: "홈" });

  const competitionHook4 = useSelectBox({ options: competitionOptions, search: true });
  const teamHook4 = useSelectBox({ options: teamOptions, search: true });
  const homeAwayHook4 = useSelectBox({ options: homeAwayOptions, defaultValue: "홈" });

  const competitionHook5 = useSelectBox({ options: competitionOptions, search: true });
  const teamHook5 = useSelectBox({ options: teamOptions, search: true });
  const homeAwayHook5 = useSelectBox({ options: homeAwayOptions, defaultValue: "홈" });

  const competitionHook6 = useSelectBox({ options: competitionOptions, search: true });
  const teamHook6 = useSelectBox({ options: teamOptions, search: true });
  const homeAwayHook6 = useSelectBox({ options: homeAwayOptions, defaultValue: "홈" });

  const competitionHook7 = useSelectBox({ options: competitionOptions, search: true });
  const teamHook7 = useSelectBox({ options: teamOptions, search: true });
  const homeAwayHook7 = useSelectBox({ options: homeAwayOptions, defaultValue: "홈" });

  const competitionHook8 = useSelectBox({ options: competitionOptions, search: true });
  const teamHook8 = useSelectBox({ options: teamOptions, search: true });
  const homeAwayHook8 = useSelectBox({ options: homeAwayOptions, defaultValue: "홈" });

  const competitionHook9 = useSelectBox({ options: competitionOptions, search: true });
  const teamHook9 = useSelectBox({ options: teamOptions, search: true });
  const homeAwayHook9 = useSelectBox({ options: homeAwayOptions, defaultValue: "홈" });

  const selectBoxHooks = [
    { competitionHook: competitionHook0, teamHook: teamHook0, homeAwayHook: homeAwayHook0 },
    { competitionHook: competitionHook1, teamHook: teamHook1, homeAwayHook: homeAwayHook1 },
    { competitionHook: competitionHook2, teamHook: teamHook2, homeAwayHook: homeAwayHook2 },
    { competitionHook: competitionHook3, teamHook: teamHook3, homeAwayHook: homeAwayHook3 },
    { competitionHook: competitionHook4, teamHook: teamHook4, homeAwayHook: homeAwayHook4 },
    { competitionHook: competitionHook5, teamHook: teamHook5, homeAwayHook: homeAwayHook5 },
    { competitionHook: competitionHook6, teamHook: teamHook6, homeAwayHook: homeAwayHook6 },
    { competitionHook: competitionHook7, teamHook: teamHook7, homeAwayHook: homeAwayHook7 },
    { competitionHook: competitionHook8, teamHook: teamHook8, homeAwayHook: homeAwayHook8 },
    { competitionHook: competitionHook9, teamHook: teamHook9, homeAwayHook: homeAwayHook9 },
  ];
  //!SECTION SelectBox 훅

  //SECTION 메서드
  const createEmptyRow = (): IBulkMatchRowState => ({
    match_date: "",
    home_away: "HOME",
    match_start_time: "",
    round_name: "",
  });

  const handleChangeMatchCount = (value: string) => {
    const parsed = Number.parseInt(value, 10);

    if (Number.isNaN(parsed) || parsed <= 0) {
      setMatchCount(1);
      setRows((prev) =>
        Array.from({ length: 1 }, (_, index) => prev[index] ?? createEmptyRow()),
      );
      return;
    }

    const safeValue = Math.min(parsed, MAX_MATCH_COUNT);

    setMatchCount(safeValue);
    setRows((prev) =>
      Array.from({ length: safeValue }, (_, index) => prev[index] ?? createEmptyRow()),
    );
  };

  const handleRowChange = <K extends keyof IBulkMatchRowState>(
    rowIndex: number,
    key: K,
    value: IBulkMatchRowState[K],
  ) => {
    setRows((prev) => {
      const next = [...prev];
      next[rowIndex] = { ...next[rowIndex], [key]: value };
      return next;
    });
  };

  const handleSubmit = async () => {
    const trimmedRows = rows.slice(0, matchCount);

    const payload = trimmedRows
      .map((row, index) => {
        const hooks = selectBoxHooks[index];

        const competitionId = (hooks.competitionHook.label as string | undefined) ?? "";
        const opponentTeamId = (hooks.teamHook.label as string | undefined) ?? "";
        const homeAwayLabel = hooks.homeAwayHook.label as HomeAwayType | undefined;
        const homeAway: HomeAwayType = homeAwayLabel ?? row.home_away;

        if (!competitionId || !opponentTeamId || !row.match_date || !row.match_start_time) {
          return null;
        }

        return {
          competition_id: competitionId,
          opponent_team_id: opponentTeamId,
          match_date: row.match_date,
          home_away: homeAway,
          match_start_time: convertLocalToUTC(row.match_start_time),
          round_name: row.round_name || undefined,
        };
      })
      .filter((item) => item !== null);

    if (payload.length === 0) {
      alert("최소 1경기 이상 필수 값(대회, 상대팀, 경기일, 경기 시작 시간)을 채워주세요.");
      return;
    }

    await bulkCreateMatches({ matches: payload });
    handleClose();
  };

  const handleClose = () => {
    setMatchCount(5);
    setRows(
      Array.from({ length: 5 }, () => ({
        match_date: "",
        home_away: "HOME",
        match_start_time: "",
        round_name: "",
      })),
    );
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
          onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
            handleChangeMatchCount(event.target.value)
          }
          size="sm"
          color="primary-100"
          className="w-24"
        />
        <span className="text-yds-b3 text-white">
          (최대 {MAX_MATCH_COUNT}경기까지 한 번에 등록할 수 있어요)
        </span>
      </div>

      <div className="scrollbar-thin mt-2 flex max-h-[55vh] flex-col gap-4 overflow-y-auto pr-2">
        {rows.slice(0, matchCount).map((row, index) => {
          const hooks = selectBoxHooks[index];

          return (
            <div key={index} className="rounded-md border border-black p-3">
              <div className="mb-2 flex items-center justify-between">
                <span className="text-yds-b2 text-primary-100">경기 {index + 1}</span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-yds-b2 mb-1 block text-primary-100">대회 *</label>
                  <SelectBox size="full" selectBoxHook={hooks.competitionHook} />
                </div>
                <div>
                  <label className="text-yds-b2 mb-1 block text-primary-100">상대팀 *</label>
                  <SelectBox size="full" selectBoxHook={hooks.teamHook} />
                </div>
                <div>
                  <label className="text-yds-b2 mb-1 block text-primary-100">경기일 *</label>
                  <Input
                    type="date"
                    value={row.match_date}
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                      handleRowChange(index, "match_date", event.target.value)
                    }
                    size="full"
                    color="primary-100"
                  />
                </div>
                <div>
                  <label className="text-yds-b2 mb-1 block text-primary-100">홈/어웨이 *</label>
                  <SelectBox size="full" selectBoxHook={hooks.homeAwayHook} />
                </div>
                <div>
                  <label className="text-yds-b2 mb-1 block text-primary-100">
                    경기 시작 시간 *
                  </label>
                  <Input
                    type="datetime-local"
                    value={row.match_start_time}
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                      handleRowChange(index, "match_start_time", event.target.value)
                    }
                    size="full"
                    color="primary-100"
                  />
                </div>
                <div>
                  <label className="text-yds-b2 mb-1 block text-primary-100">라운드명</label>
                  <Input
                    type="text"
                    value={row.round_name}
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                      handleRowChange(index, "round_name", event.target.value)
                    }
                    placeholder="예: 1라운드"
                    size="full"
                    color="primary-100"
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-4 flex gap-2">
        <Button variant="outlined" color="primary" size="full" onClick={handleClose}>
          취소
        </Button>
        <Button
          variant="fill"
          color="primary"
          size="full"
          onClick={handleSubmit}
          disabled={isCreating}
        >
          {isCreating ? "대량 추가 중..." : "대량 추가"}
        </Button>
      </div>
    </div>
  );
};

