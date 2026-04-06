/**
 * 작성자: KYD
 * 기능: 경기 일괄 추가 개별 행 컴포넌트
 * 프로세스 설명: 각 행이 자체 SelectBox hook을 관리하여 Bulk Add 모달의 hook 하드코딩 제거
 */
import { useMemo } from "react";

import { Input, SelectBox, useSelectBox } from "@youngduck/yd-ui";

import { extractKSTDateFromLocal } from "@admin/admin-match/utils/datetime-utils";

interface ICompetitionOption {
  label: string;
  value: string;
}

interface ITeamOption {
  label: string;
  value: string;
}

interface IBulkAddRowData {
  match_start_time: string;
  round_name: string;
}

interface IAdminMatchBulkAddRowProps {
  index: number;
  row: IBulkAddRowData;
  competitionOptions: ICompetitionOption[];
  teamOptions: ITeamOption[];
  onRowChange: (index: number, key: keyof IBulkAddRowData, value: string) => void;
  onHooksReady: (index: number, hooks: IBulkAddRowHooks) => void;
}

export interface IBulkAddRowHooks {
  competitionLabel: string;
  teamLabel: string;
  homeAwayLabel: string;
}

const AdminMatchBulkAddRow = ({
  index,
  row,
  competitionOptions,
  teamOptions,
  onRowChange,
  onHooksReady,
}: IAdminMatchBulkAddRowProps) => {
  //SECTION SelectBox 훅
  const homeAwayOptions = useMemo(
    () => [
      { label: "HOME", value: "홈" },
      { label: "AWAY", value: "어웨이" },
    ],
    [],
  );

  const competitionHook = useSelectBox({ options: competitionOptions, search: true });
  const teamHook = useSelectBox({ options: teamOptions, search: true });
  const homeAwayHook = useSelectBox({ options: homeAwayOptions, defaultValue: "홈" });

  onHooksReady(index, {
    competitionLabel: (competitionHook.label as string) || "",
    teamLabel: (teamHook.label as string) || "",
    homeAwayLabel: (homeAwayHook.label as string) || "HOME",
  });
  //!SECTION SelectBox 훅

  return (
    <div className="rounded-md border border-black p-3">
      <div className="mb-2 flex items-center justify-between">
        <span className="text-yds-b2 text-primary-100">경기 {index + 1}</span>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-yds-b2 text-primary-100 mb-1 block">대회 *</label>
          <SelectBox size="full" selectBoxHook={competitionHook} />
        </div>
        <div>
          <label className="text-yds-b2 text-primary-100 mb-1 block">상대팀 *</label>
          <SelectBox size="full" selectBoxHook={teamHook} />
        </div>
        <div>
          <label className="text-yds-b2 text-primary-100 mb-1 block">경기 시작 시간 (한국기준) *</label>
          <Input
            type="datetime-local"
            value={row.match_start_time}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
              onRowChange(index, "match_start_time", event.target.value)
            }
            size="full"
            color="primary-100"
          />
          {row.match_start_time && (
            <p className="text-yds-c1m text-primary-60 mt-1">경기일: {extractKSTDateFromLocal(row.match_start_time)}</p>
          )}
        </div>
        <div>
          <label className="text-yds-b2 text-primary-100 mb-1 block">홈/어웨이 *</label>
          <SelectBox size="full" selectBoxHook={homeAwayHook} />
        </div>
        <div>
          <label className="text-yds-b2 text-primary-100 mb-1 block">라운드명</label>
          <Input
            type="text"
            value={row.round_name}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
              onRowChange(index, "round_name", event.target.value)
            }
            placeholder="예: 28R"
            size="full"
            color="primary-100"
          />
        </div>
      </div>
    </div>
  );
};

export default AdminMatchBulkAddRow;
