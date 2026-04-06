/**
 * 작성자: KYD
 * 기능: 경기 추가 모달 컴포넌트
 * 프로세스 설명: 경기 시작 시간만 입력하면 match_date와 나머지 시간 필드를 자동 계산하여 경기 생성
 */
import { useMemo, useState } from "react";

import { Button, Input, SelectBox, useSelectBox } from "@youngduck/yd-ui";

import { useGetAllCompetitionsSuspense } from "@admin/admin-competition/api/react-query-api/use-get-all-competitions-suspense";
import { useCreateMatch } from "@admin/admin-match/api/react-query-api/use-create-match";
import {
  calculateMatchTimes,
  convertLocalToUTC,
  extractKSTDateFromLocal,
} from "@admin/admin-match/utils/datetime-utils";
import { useGetAllTeamsSuspense } from "@admin/admin-team/api/react-query-api/use-get-all-teams-suspense";

interface IAdminMatchAddModal {
  onClose: () => void;
}

export const AdminMatchAddModal = ({ onClose }: IAdminMatchAddModal) => {
  //SECTION HOOK호출 영역
  const { data: competitions } = useGetAllCompetitionsSuspense();
  const { data: teams } = useGetAllTeamsSuspense();
  const { mutateAsync: createMatch, isPending: isCreating } = useCreateMatch();
  //!SECTION HOOK호출 영역

  //SECTION 상태값 영역
  const [formData, setFormData] = useState({
    home_away: "HOME" as "HOME" | "AWAY",
    round_name: "",
    match_start_time: "",
  });
  //!SECTION 상태값 영역

  //SECTION SelectBox 옵션/훅
  const competitionOptions = useMemo(
    () =>
      competitions.map((c) => ({
        label: c.id,
        value: `${c.name} (${c.season})`,
      })),
    [competitions],
  );

  const teamOptions = useMemo(() => teams.map((t) => ({ label: t.id, value: t.name })), [teams]);

  const homeAwayOptions = useMemo(
    () => [
      { label: "HOME", value: "홈" },
      { label: "AWAY", value: "어웨이" },
    ],
    [],
  );

  const createCompetitionHook = useSelectBox({ options: competitionOptions, search: true });
  const createTeamHook = useSelectBox({ options: teamOptions, search: true });
  const createHomeAwayHook = useSelectBox({ options: homeAwayOptions, defaultValue: "홈" });
  //!SECTION SelectBox 옵션/훅

  //SECTION 메서드 영역
  const handleCreateMatch = async () => {
    const matchTimes = calculateMatchTimes(formData.match_start_time);
    const matchDate = extractKSTDateFromLocal(formData.match_start_time);

    await createMatch({
      competition_id: createCompetitionHook.label || "",
      opponent_team_id: createTeamHook.label || "",
      match_date: matchDate,
      home_away: (createHomeAwayHook.label as "HOME" | "AWAY") || formData.home_away,
      round_name: formData.round_name || undefined,
      match_start_time: convertLocalToUTC(matchTimes.match_start_time),
      first_half_end_time: convertLocalToUTC(matchTimes.first_half_end_time),
      second_half_start_time: convertLocalToUTC(matchTimes.second_half_start_time),
      second_half_end_time: convertLocalToUTC(matchTimes.second_half_end_time),
    });
    handleClose();
  };

  const handleClose = () => {
    setFormData({
      home_away: "HOME",
      round_name: "",
      match_start_time: "",
    });
    onClose();
  };
  //!SECTION 메서드 영역

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-yds-b1 text-primary-100">새 경기 추가</h2>
      <div className="space-y-4">
        <div>
          <label className="text-yds-b1 text-primary-100">대회 *</label>
          <SelectBox size="full" selectBoxHook={createCompetitionHook} />
        </div>
        <div>
          <label className="text-yds-b1 text-primary-100">상대팀 *</label>
          <SelectBox size="full" selectBoxHook={createTeamHook} />
        </div>
        <div>
          <label className="text-yds-b1 text-primary-100">홈/어웨이 *</label>
          <SelectBox size="full" selectBoxHook={createHomeAwayHook} />
        </div>
        <div>
          <label className="text-yds-b1 text-primary-100">경기 시작 시간 (한국시간) *</label>
          <Input
            type="datetime-local"
            value={formData.match_start_time}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setFormData({ ...formData, match_start_time: e.target.value })
            }
            placeholder="경기 시작 시간"
            size="full"
            color="primary-100"
          />
          {formData.match_start_time && (
            <p className="mt-1 text-yds-c1m text-primary-60">
              경기일: {extractKSTDateFromLocal(formData.match_start_time)} | 전반종료: +45분 | 후반시작: +60분 |
              후반종료: +105분 (수정 모달에서 개별 조정 가능)
            </p>
          )}
        </div>
        <div>
          <label className="text-yds-b1 text-primary-100">라운드명</label>
          <Input
            type="text"
            value={formData.round_name}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setFormData({ ...formData, round_name: e.target.value })
            }
            size="full"
            color="primary-100"
            placeholder="예: 28R"
          />
        </div>
      </div>
      <div className="mt-6 flex gap-2">
        <Button variant="outlined" color="primary" size="full" onClick={handleClose}>
          취소
        </Button>
        <Button
          variant="fill"
          color="primary"
          size="full"
          onClick={handleCreateMatch}
          disabled={isCreating || !createCompetitionHook.label || !createTeamHook.label || !formData.match_start_time}
        >
          {isCreating ? "추가 중..." : "추가"}
        </Button>
      </div>
    </div>
  );
};
