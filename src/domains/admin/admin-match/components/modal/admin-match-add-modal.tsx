/**
 * 작성자: KYD
 * 기능: 경기 추가 모달 컴포넌트
 * 프로세스 설명: 경기 추가 폼을 모달로 표시
 */
import { useMemo, useState } from "react";

import { Button, Input, SelectBox, useSelectBox } from "@youngduck/yd-ui";

import { useGetAllCompetitionsSuspense } from "@admin/admin-competition/api/react-query-api/use-get-all-competitions-suspense";
import { useCreateMatch } from "@admin/admin-match/api/react-query-api/use-create-match";
import { convertLocalToUTC } from "@admin/admin-match/utils/datetime-utils";
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
    competition_id: "",
    opponent_team_id: "",
    match_date: "",
    home_away: "HOME" as "HOME" | "AWAY",
    our_score: 0,
    opponent_score: 0,
    formation: "",
    is_live: false,
    round_name: "",
    match_start_time: "",
    second_half_start_time: "",
    first_half_end_time: "",
    second_half_end_time: "",
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
    await createMatch({
      competition_id: createCompetitionHook.label || formData.competition_id,
      opponent_team_id: createTeamHook.label || formData.opponent_team_id,
      match_date: formData.match_date,
      home_away: (createHomeAwayHook.label as "HOME" | "AWAY") || formData.home_away,
      our_score: formData.our_score,
      opponent_score: formData.opponent_score,
      formation: formData.formation || undefined,
      is_live: formData.is_live,
      round_name: formData.round_name || undefined,
      match_start_time: convertLocalToUTC(formData.match_start_time),
      second_half_start_time: convertLocalToUTC(formData.second_half_start_time),
      first_half_end_time: convertLocalToUTC(formData.first_half_end_time),
      second_half_end_time: convertLocalToUTC(formData.second_half_end_time),
    });
    handleClose();
  };

  const handleClose = () => {
    setFormData({
      competition_id: "",
      opponent_team_id: "",
      match_date: "",
      home_away: "HOME",
      our_score: 0,
      opponent_score: 0,
      formation: "",
      is_live: false,
      round_name: "",
      match_start_time: "",
      second_half_start_time: "",
      first_half_end_time: "",
      second_half_end_time: "",
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
          <label className="text-yds-b1 text-primary-100">경기일 *</label>
          <Input
            type="date"
            value={formData.match_date}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setFormData({ ...formData, match_date: e.target.value })
            }
            size="full"
            color="primary-100"
          />
        </div>
        <div>
          <label className="text-yds-b1 text-primary-100">홈/어웨이 *</label>
          <SelectBox size="full" selectBoxHook={createHomeAwayHook} />
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="text-yds-b1 text-primary-100">우리 점수</label>
            <Input
              type="number"
              min={0}
              value={formData.our_score}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setFormData({ ...formData, our_score: parseInt(e.target.value) || 0 })
              }
              size="full"
              color="primary-100"
            />
          </div>
          <div>
            <label className="text-yds-b1 text-primary-100">상대 점수</label>
            <Input
              type="number"
              min={0}
              value={formData.opponent_score}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setFormData({ ...formData, opponent_score: parseInt(e.target.value) || 0 })
              }
              size="full"
              color="primary-100"
            />
          </div>
        </div>
        <div>
          <label className="text-yds-b1 text-primary-100">포메이션</label>
          <Input
            type="text"
            value={formData.formation}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setFormData({ ...formData, formation: e.target.value })
            }
            size="full"
            color="primary-100"
            placeholder="예: 4-3-3"
          />
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
            placeholder="예: 1라운드"
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-yds-b1 text-primary-100">경기 시작 시간</label>
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
          </div>
          <div>
            <label className="text-yds-b1 text-primary-100">후반 시작 시간</label>
            <Input
              type="datetime-local"
              value={formData.second_half_start_time}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setFormData({ ...formData, second_half_start_time: e.target.value })
              }
              placeholder="후반 시작 시간"
              size="full"
              color="primary-100"
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-yds-b1 text-primary-100">전반 종료 시간</label>
            <Input
              type="datetime-local"
              value={formData.first_half_end_time}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setFormData({ ...formData, first_half_end_time: e.target.value })
              }
              placeholder="전반 종료 시간"
              size="full"
              color="primary-100"
            />
          </div>
          <div>
            <label className="text-yds-b1 text-primary-100">후반 종료 시간</label>
            <Input
              type="datetime-local"
              value={formData.second_half_end_time}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setFormData({ ...formData, second_half_end_time: e.target.value })
              }
              placeholder="후반 종료 시간"
              size="full"
              color="primary-100"
            />
          </div>
        </div>
        <div className="flex items-center">
          <input
            type="checkbox"
            checked={formData.is_live}
            onChange={(e) => setFormData({ ...formData, is_live: e.target.checked })}
            className="mr-2"
          />
          <label className="text-primary-100 text-sm">라이브 경기</label>
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
          disabled={isCreating || !createCompetitionHook.label || !createTeamHook.label || !formData.match_date}
        >
          {isCreating ? "추가 중..." : "추가"}
        </Button>
      </div>
    </div>
  );
};

