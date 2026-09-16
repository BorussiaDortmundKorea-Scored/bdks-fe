/**
 * 작성자: KYD
 * 기능: 경기 추가 모달 컴포넌트
 * 프로세스 설명: 경기 시작 시간만 입력하면 match_date와 나머지 시간 필드를 자동 계산하여 경기 생성.
 *                대회·상대팀은 SelectBox 훅이 값의 원천이라 제출 직전에 payload 를 조립해 검증한다
 */
import { useMemo, useState } from "react";

import { Button, Field, Input, SelectBox, useSelectBox } from "@youngduck/yd-ui";

import { useGetActiveCompetitionsSuspense } from "@admin/admin-competition/api/react-query-api/use-get-active-competitions-suspense";
import { useCreateMatch } from "@admin/admin-match/api/react-query-api/use-create-match";
import { type IAdminMatchFormValues, adminMatchFormSchema } from "@admin/admin-match/schemas/admin-match-schema";
import {
  calculateMatchTimes,
  convertLocalToUTC,
  extractKSTDateFromLocal,
} from "@admin/admin-match/utils/datetime-utils";
import { useGetAllTeamsSuspense } from "@admin/admin-team/api/react-query-api/use-get-all-teams-suspense";

import { toFieldErrors } from "@shared/hooks/use-zod-form";

interface IAdminMatchAddModal {
  onClose: () => void;
}

export const AdminMatchAddModal = ({ onClose }: IAdminMatchAddModal) => {
  //SECTION HOOK호출 영역
  const { data: competitions } = useGetActiveCompetitionsSuspense();
  const { data: teams } = useGetAllTeamsSuspense();
  const { mutateAsync: createMatch, isPending: isCreating } = useCreateMatch();
  //!SECTION HOOK호출 영역

  //SECTION 상태값 영역
  const [matchStartTime, setMatchStartTime] = useState("");
  const [roundName, setRoundName] = useState("");
  const [errors, setErrors] = useState<Partial<Record<keyof IAdminMatchFormValues, string>>>({});
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
    const result = adminMatchFormSchema.safeParse({
      competition_id: createCompetitionHook.label,
      opponent_team_id: createTeamHook.label,
      match_start_time: matchStartTime,
      home_away: createHomeAwayHook.label,
      round_name: roundName,
    });

    if (!result.success) {
      setErrors(toFieldErrors<IAdminMatchFormValues>(result.error));
      return;
    }
    setErrors({});

    const matchTimes = calculateMatchTimes(result.data.match_start_time);

    await createMatch({
      competition_id: result.data.competition_id,
      opponent_team_id: result.data.opponent_team_id,
      match_date: extractKSTDateFromLocal(result.data.match_start_time),
      home_away: result.data.home_away,
      round_name: result.data.round_name || undefined,
      match_start_time: convertLocalToUTC(matchTimes.match_start_time),
      first_half_end_time: convertLocalToUTC(matchTimes.first_half_end_time),
      second_half_start_time: convertLocalToUTC(matchTimes.second_half_start_time),
      second_half_end_time: convertLocalToUTC(matchTimes.second_half_end_time),
    });
    handleClose();
  };

  const handleClose = () => {
    setMatchStartTime("");
    setRoundName("");
    setErrors({});
    onClose();
  };
  //!SECTION 메서드 영역

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-yds-b1 text-primary-100">새 경기 추가</h2>
      <div className="space-y-4">
        <Field label="대회" required error={errors.competition_id}>
          <SelectBox size="full" selectBoxHook={createCompetitionHook} />
        </Field>
        <Field label="상대팀" required error={errors.opponent_team_id}>
          <SelectBox size="full" selectBoxHook={createTeamHook} />
        </Field>
        <Field label="홈/어웨이" required error={errors.home_away}>
          <SelectBox size="full" selectBoxHook={createHomeAwayHook} />
        </Field>
        <Field
          label="경기 시작 시간 (한국시간)"
          required
          error={errors.match_start_time}
          description={
            matchStartTime
              ? `경기일: ${extractKSTDateFromLocal(matchStartTime)} | 전반종료: +45분 | 후반시작: +60분 | 후반종료: +105분 (수정 모달에서 개별 조정 가능)`
              : undefined
          }
        >
          <Input
            type="datetime-local"
            value={matchStartTime}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setMatchStartTime(e.target.value)}
            placeholder="경기 시작 시간"
            size="full"
            color="primary-100"
          />
        </Field>
        <Field label="라운드명" error={errors.round_name}>
          <Input
            type="text"
            value={roundName}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setRoundName(e.target.value)}
            size="full"
            color="primary-100"
            placeholder="예: 28R"
          />
        </Field>
      </div>
      <div className="mt-6 flex gap-2">
        <Button variant="outlined" color="primary" size="full" onClick={handleClose}>
          취소
        </Button>
        <Button variant="fill" color="primary" size="full" onClick={handleCreateMatch} disabled={isCreating}>
          {isCreating ? "추가 중..." : "추가"}
        </Button>
      </div>
    </div>
  );
};
