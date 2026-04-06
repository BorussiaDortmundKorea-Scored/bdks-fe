/**
 * 작성자: KYD
 * 기능: 경기 수정 모달 컴포넌트
 * 프로세스 설명: 경기 수정 폼을 모달로 표시, 시작 시간 변경 시 자동재계산 토글 제공
 */
import { useEffect, useMemo, useState } from "react";

import { Button, CheckBox, Input, SelectBox, useSelectBox } from "@youngduck/yd-ui";

import { useGetAllCompetitionsSuspense } from "@admin/admin-competition/api/react-query-api/use-get-all-competitions-suspense";
import type { IMatch } from "@admin/admin-match/api/admin-match-api";
import { useUpdateMatch } from "@admin/admin-match/api/react-query-api/use-update-match";
import {
  calculateMatchTimes,
  convertLocalToUTC,
  convertUTCToLocal,
  extractKSTDateFromLocal,
} from "@admin/admin-match/utils/datetime-utils";
import { useGetAllTeamsSuspense } from "@admin/admin-team/api/react-query-api/use-get-all-teams-suspense";

interface IAdminMatchEditModal {
  match: IMatch;
  onClose: () => void;
}

export const AdminMatchEditModal = ({ match, onClose }: IAdminMatchEditModal) => {
  //SECTION HOOK호출 영역
  const { data: competitions } = useGetAllCompetitionsSuspense();
  const { data: teams } = useGetAllTeamsSuspense();
  const { mutateAsync: updateMatch, isPending: isUpdating } = useUpdateMatch();
  //!SECTION HOOK호출 영역

  //SECTION 상태값 영역
  const [autoCalc, setAutoCalc] = useState(false);
  const [formData, setFormData] = useState({
    home_away: "HOME" as "HOME" | "AWAY",
    our_score: 0,
    opponent_score: 0,
    formation: "",
    is_live: false,
    round_name: "",
    match_start_time: "",
    first_half_end_time: "",
    second_half_start_time: "",
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

  const getCompetitionValueById = (id: string) => competitionOptions.find((o) => o.label === id)?.value;
  const getTeamValueById = (id: string) => teamOptions.find((o) => o.label === id)?.value;

  const editCompetitionHook = useSelectBox({
    options: competitionOptions,
    search: true,
    defaultValue: match.competition_id ? getCompetitionValueById(match.competition_id) : undefined,
  });
  const editTeamHook = useSelectBox({
    options: teamOptions,
    search: true,
    defaultValue: match.opponent_team_id ? getTeamValueById(match.opponent_team_id) : undefined,
  });
  const editHomeAwayHook = useSelectBox({
    options: homeAwayOptions,
    defaultValue: match.home_away === "HOME" ? "홈" : "어웨이",
  });
  //!SECTION SelectBox 옵션/훅

  //SECTION 메서드 영역
  useEffect(() => {
    setFormData({
      home_away: (match.home_away as "HOME" | "AWAY") || "HOME",
      our_score: match.our_score ?? 0,
      opponent_score: match.opponent_score ?? 0,
      formation: match.formation || "",
      is_live: match.is_live ?? false,
      round_name: match.round_name || "",
      match_start_time: convertUTCToLocal(match.match_start_time),
      first_half_end_time: convertUTCToLocal(match.first_half_end_time),
      second_half_start_time: convertUTCToLocal(match.second_half_start_time),
      second_half_end_time: convertUTCToLocal(match.second_half_end_time),
    });
  }, [match]);

  const handleStartTimeChange = (value: string) => {
    if (autoCalc) {
      const times = calculateMatchTimes(value);
      setFormData((prev) => ({
        ...prev,
        ...times,
      }));
    } else {
      setFormData((prev) => ({ ...prev, match_start_time: value }));
    }
  };

  const handleUpdateMatch = async () => {
    const matchDate = extractKSTDateFromLocal(formData.match_start_time);

    await updateMatch({
      id: match.id,
      competition_id: editCompetitionHook.label || match.competition_id || undefined,
      opponent_team_id: editTeamHook.label || match.opponent_team_id || undefined,
      match_date: matchDate || undefined,
      home_away: (editHomeAwayHook.label as "HOME" | "AWAY") || formData.home_away,
      our_score: formData.our_score ?? undefined,
      opponent_score: formData.opponent_score ?? undefined,
      formation: formData.formation || undefined,
      is_live: formData.is_live ?? undefined,
      round_name: formData.round_name || undefined,
      match_start_time: convertLocalToUTC(formData.match_start_time),
      first_half_end_time: convertLocalToUTC(formData.first_half_end_time),
      second_half_start_time: convertLocalToUTC(formData.second_half_start_time),
      second_half_end_time: convertLocalToUTC(formData.second_half_end_time),
    });
    handleClose();
  };

  const handleClose = () => {
    setFormData({
      home_away: "HOME",
      our_score: 0,
      opponent_score: 0,
      formation: "",
      is_live: false,
      round_name: "",
      match_start_time: "",
      first_half_end_time: "",
      second_half_start_time: "",
      second_half_end_time: "",
    });
    onClose();
  };
  //!SECTION 메서드 영역

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-yds-b1 text-primary-100">경기 수정</h2>
      <div className="space-y-4">
        <div>
          <label className="text-yds-b1 text-primary-100">대회 *</label>
          <SelectBox size="full" selectBoxHook={editCompetitionHook} />
        </div>
        <div>
          <label className="text-yds-b1 text-primary-100">상대팀 *</label>
          <SelectBox size="full" selectBoxHook={editTeamHook} />
        </div>
        <div>
          <label className="text-yds-b1 text-primary-100">홈/어웨이 *</label>
          <SelectBox size="full" selectBoxHook={editHomeAwayHook} />
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
            placeholder="예: 28R"
          />
        </div>

        <div>
          <div className="mb-2 flex items-center justify-between">
            <label className="text-yds-b1 text-primary-100">경기 시간 설정</label>
            <CheckBox checked={autoCalc} onCheckedChange={setAutoCalc} value="경기시간 일괄변경" shape="square" />
          </div>
          <div className="flex flex-col gap-3">
            <div>
              <label className="text-yds-c1m text-primary-100">경기 시작</label>
              <Input
                type="datetime-local"
                value={formData.match_start_time}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleStartTimeChange(e.target.value)}
                size="full"
                color="primary-100"
              />
            </div>
            <div>
              <label className="text-yds-c1m text-primary-100">전반 종료</label>
              <Input
                type="datetime-local"
                value={formData.first_half_end_time}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setFormData({ ...formData, first_half_end_time: e.target.value })
                }
                size="full"
                color="primary-100"
              />
            </div>
            <div>
              <label className="text-yds-c1m text-primary-100">후반 시작</label>
              <Input
                type="datetime-local"
                value={formData.second_half_start_time}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setFormData({ ...formData, second_half_start_time: e.target.value })
                }
                size="full"
                color="primary-100"
              />
            </div>
            <div>
              <label className="text-yds-c1m text-primary-100">후반 종료</label>
              <Input
                type="datetime-local"
                value={formData.second_half_end_time}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setFormData({ ...formData, second_half_end_time: e.target.value })
                }
                size="full"
                color="primary-100"
              />
            </div>
          </div>
        </div>

        <CheckBox
          checked={formData.is_live ?? false}
          onCheckedChange={(checked) => setFormData({ ...formData, is_live: checked })}
          value="라이브 경기여부"
          shape="square"
        />
      </div>
      <div className="mt-6 flex gap-2">
        <Button variant="outlined" color="primary" size="full" onClick={handleClose}>
          취소
        </Button>
        <Button
          variant="fill"
          color="primary"
          size="full"
          onClick={handleUpdateMatch}
          disabled={isUpdating || !editCompetitionHook.label || !editTeamHook.label || !formData.match_start_time}
        >
          {isUpdating ? "수정 중..." : "수정"}
        </Button>
      </div>
    </div>
  );
};
