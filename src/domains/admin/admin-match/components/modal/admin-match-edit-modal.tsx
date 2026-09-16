/**
 * 작성자: KYD
 * 기능: 경기 수정 모달 컴포넌트
 * 프로세스 설명: 경기 수정 폼을 모달로 표시, 시작 시간 변경 시 자동재계산 토글 제공.
 *                대회·상대팀은 SelectBox 훅이 값의 원천이라 제출 직전에 payload 를 조립해 검증한다
 */
import { useMemo, useState } from "react";

import { Button, CheckBox, Field, Input, NumberInput, SelectBox, useSelectBox } from "@youngduck/yd-ui";

import { useGetAllCompetitionsSuspense } from "@admin/admin-competition/api/react-query-api/use-get-all-competitions-suspense";
import type { IMatch } from "@admin/admin-match/api/admin-match-api";
import { useUpdateMatch } from "@admin/admin-match/api/react-query-api/use-update-match";
import {
  type IAdminMatchEditFormValues,
  adminMatchEditFormSchema,
} from "@admin/admin-match/schemas/admin-match-schema";
import {
  calculateMatchTimes,
  convertLocalToUTC,
  convertUTCToLocal,
  extractKSTDateFromLocal,
} from "@admin/admin-match/utils/datetime-utils";
import { useGetAllTeamsSuspense } from "@admin/admin-team/api/react-query-api/use-get-all-teams-suspense";

import { toFieldErrors } from "@shared/hooks/use-zod-form";

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
  // 모달은 행마다 새로 마운트되므로 초기값을 props 에서 바로 만든다
  const [formData, setFormData] = useState({
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
  const [errors, setErrors] = useState<Partial<Record<keyof IAdminMatchEditFormValues, string>>>({});
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
  const setField = <TKey extends keyof typeof formData>(key: TKey, value: (typeof formData)[TKey]) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleStartTimeChange = (value: string) => {
    if (autoCalc) {
      setFormData((prev) => ({ ...prev, ...calculateMatchTimes(value) }));
      return;
    }
    setField("match_start_time", value);
  };

  const handleUpdateMatch = async () => {
    const result = adminMatchEditFormSchema.safeParse({
      ...formData,
      competition_id: editCompetitionHook.label || match.competition_id || "",
      opponent_team_id: editTeamHook.label || match.opponent_team_id || "",
      home_away: editHomeAwayHook.label || match.home_away,
    });

    if (!result.success) {
      setErrors(toFieldErrors<IAdminMatchEditFormValues>(result.error));
      return;
    }
    setErrors({});

    await updateMatch({
      id: match.id,
      competition_id: result.data.competition_id,
      opponent_team_id: result.data.opponent_team_id,
      match_date: extractKSTDateFromLocal(result.data.match_start_time) || undefined,
      home_away: result.data.home_away,
      our_score: result.data.our_score,
      opponent_score: result.data.opponent_score,
      formation: result.data.formation || undefined,
      is_live: result.data.is_live,
      round_name: result.data.round_name || undefined,
      match_start_time: convertLocalToUTC(result.data.match_start_time),
      first_half_end_time: convertLocalToUTC(result.data.first_half_end_time),
      second_half_start_time: convertLocalToUTC(result.data.second_half_start_time),
      second_half_end_time: convertLocalToUTC(result.data.second_half_end_time),
    });
    onClose();
  };
  //!SECTION 메서드 영역

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-yds-b1 text-primary-100">경기 수정</h2>
      <div className="space-y-4">
        <Field label="대회" required error={errors.competition_id}>
          <SelectBox size="full" selectBoxHook={editCompetitionHook} />
        </Field>
        <Field label="상대팀" required error={errors.opponent_team_id}>
          <SelectBox size="full" selectBoxHook={editTeamHook} />
        </Field>
        <Field label="홈/어웨이" required error={errors.home_away}>
          <SelectBox size="full" selectBoxHook={editHomeAwayHook} />
        </Field>
        <div className="grid grid-cols-2 gap-2">
          <Field label="우리 점수" error={errors.our_score}>
            <NumberInput
              min={0}
              value={String(formData.our_score)}
              onValueChange={(value: string) => setField("our_score", value === "" ? 0 : Number(value))}
              size="full"
              align="left"
            />
          </Field>
          <Field label="상대 점수" error={errors.opponent_score}>
            <NumberInput
              min={0}
              value={String(formData.opponent_score)}
              onValueChange={(value: string) => setField("opponent_score", value === "" ? 0 : Number(value))}
              size="full"
              align="left"
            />
          </Field>
        </div>
        <Field label="포메이션" error={errors.formation}>
          <Input
            type="text"
            value={formData.formation}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setField("formation", e.target.value)}
            size="full"
            color="primary-100"
            placeholder="예: 4-3-3"
          />
        </Field>
        <Field label="라운드명" error={errors.round_name}>
          <Input
            type="text"
            value={formData.round_name}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setField("round_name", e.target.value)}
            size="full"
            color="primary-100"
            placeholder="예: 28R"
          />
        </Field>

        <div>
          <div className="mb-2 flex items-center justify-between">
            <span className="text-yds-b1 text-primary-100">경기 시간 설정</span>
            <CheckBox checked={autoCalc} onCheckedChange={setAutoCalc} value="경기시간 일괄변경" shape="square" />
          </div>
          <div className="flex flex-col gap-3">
            <Field label="경기 시작" required error={errors.match_start_time}>
              <Input
                type="datetime-local"
                value={formData.match_start_time}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleStartTimeChange(e.target.value)}
                size="full"
                color="primary-100"
              />
            </Field>
            <Field label="전반 종료" error={errors.first_half_end_time}>
              <Input
                type="datetime-local"
                value={formData.first_half_end_time}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setField("first_half_end_time", e.target.value)}
                size="full"
                color="primary-100"
              />
            </Field>
            <Field label="후반 시작" error={errors.second_half_start_time}>
              <Input
                type="datetime-local"
                value={formData.second_half_start_time}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setField("second_half_start_time", e.target.value)
                }
                size="full"
                color="primary-100"
              />
            </Field>
            <Field label="후반 종료" error={errors.second_half_end_time}>
              <Input
                type="datetime-local"
                value={formData.second_half_end_time}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setField("second_half_end_time", e.target.value)}
                size="full"
                color="primary-100"
              />
            </Field>
          </div>
        </div>

        <CheckBox
          checked={formData.is_live ?? false}
          onCheckedChange={(checked) => setField("is_live", checked)}
          value="라이브 경기여부"
          shape="square"
        />
      </div>
      <div className="mt-6 flex gap-2">
        <Button variant="outlined" color="primary" size="full" onClick={onClose}>
          취소
        </Button>
        <Button variant="fill" color="primary" size="full" onClick={handleUpdateMatch} disabled={isUpdating}>
          {isUpdating ? "수정 중..." : "수정"}
        </Button>
      </div>
    </div>
  );
};
