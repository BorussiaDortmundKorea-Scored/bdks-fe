/**
 * 작성자: KYD
 * 기능: 대회 추가 모달 컴포넌트
 * 프로세스 설명: 대회 종류(마스터)·시즌(마스터)을 드롭다운으로 선택해 대회 추가
 * 참고: yd-ui SelectBox는 option.value를 화면에 표시하므로 value에 "대회명"을 담고,
 *       제출 시 competition_types에서 name -> id 로 변환한다 (name은 UNIQUE).
 */
import { useMemo } from "react";

import { Button, Field, SelectBox, useSelectBox } from "@youngduck/yd-ui";

import { useCreateCompetition } from "@admin/admin-competition/api/react-query-api/use-create-competition";
import { useGetAllCompetitionTypes } from "@admin/admin-competition/api/react-query-api/use-get-all-competition-types";
import { useGetAllSeasons } from "@admin/admin-competition/api/react-query-api/use-get-all-seasons";
import {
  ADMIN_COMPETITION_FORM_INITIAL_VALUES,
  adminCompetitionFormSchema,
} from "@admin/admin-competition/schemas/admin-competition-schema";

import { useZodForm } from "@shared/hooks/use-zod-form";

interface IAdminCompetitionAddModal {
  onClose: () => void;
}

export const AdminCompetitionAddModal = ({ onClose }: IAdminCompetitionAddModal) => {
  //SECTION HOOK호출 영역
  const { mutateAsync: createCompetition, isPending: isCreating } = useCreateCompetition();
  const { data: competitionTypes = [] } = useGetAllCompetitionTypes();
  const { data: seasons = [] } = useGetAllSeasons();
  const { values, errors, setValue, setFieldError, reset, validate } = useZodForm(
    adminCompetitionFormSchema,
    ADMIN_COMPETITION_FORM_INITIAL_VALUES,
  );

  // value = 대회명(화면 표시), label = id(React key 전용)
  const typeOptions = useMemo(
    () => competitionTypes.map((type) => ({ label: type.id, value: type.name })),
    [competitionTypes],
  );
  const seasonOptions = useMemo(() => seasons.map((s) => ({ label: s, value: s })), [seasons]);

  const typeSelectBox = useSelectBox({
    options: typeOptions,
    value: values.competitionTypeName,
    onChange: (value) => setValue("competitionTypeName", value),
  });
  const seasonSelectBox = useSelectBox({
    options: seasonOptions,
    value: values.season,
    onChange: (value) => setValue("season", value),
  });
  //!SECTION HOOK호출 영역

  //SECTION 메서드 영역
  const handleCreateCompetition = async () => {
    const parsed = validate();
    if (!parsed) return;

    const competitionTypeId = competitionTypes.find((type) => type.name === parsed.competitionTypeName)?.id;
    // 목록이 갱신되는 사이 고른 대회가 사라질 수 있다. 조용히 멈추면 왜 안 되는지 알 수 없다
    if (!competitionTypeId) {
      setFieldError("competitionTypeName", "선택한 대회 종류를 찾을 수 없어요. 다시 선택해주세요");
      return;
    }

    await createCompetition({ competition_type_id: competitionTypeId, season: parsed.season });
    handleClose();
  };

  const handleClose = () => {
    reset();
    onClose();
  };
  //!SECTION 메서드 영역

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-yds-b1 text-primary-100">새 대회 추가</h2>
      <div className="flex flex-col gap-4">
        <Field label="대회 종류" required error={errors.competitionTypeName}>
          <SelectBox selectBoxHook={typeSelectBox} size="full" label="대회 종류 선택" />
        </Field>
        <Field label="시즌" required error={errors.season}>
          <SelectBox selectBoxHook={seasonSelectBox} size="full" label="시즌 선택" />
        </Field>
      </div>
      <div className="mt-6 flex gap-2">
        <Button variant="outlined" color="primary" size="full" onClick={handleClose}>
          취소
        </Button>
        <Button variant="fill" color="primary" size="full" onClick={handleCreateCompetition} disabled={isCreating}>
          {isCreating ? "추가 중..." : "추가"}
        </Button>
      </div>
    </div>
  );
};
