/**
 * 작성자: KYD
 * 기능: 대회 수정 모달 컴포넌트
 * 프로세스 설명: 대회 종류(마스터)·시즌(마스터)을 드롭다운으로 선택해 대회 수정
 * 참고: yd-ui SelectBox는 option.value를 화면에 표시하므로 value에 "대회명"을 담고,
 *       제출 시 competition_types에서 name -> id 로 변환한다 (name은 UNIQUE).
 */
import { useMemo } from "react";

import { Button, Field, SelectBox, useSelectBox } from "@youngduck/yd-ui";

import type { ICompetition } from "@admin/admin-competition/api/admin-competition-api";
import { useGetAllCompetitionTypes } from "@admin/admin-competition/api/react-query-api/use-get-all-competition-types";
import { useGetAllSeasons } from "@admin/admin-competition/api/react-query-api/use-get-all-seasons";
import { useUpdateCompetition } from "@admin/admin-competition/api/react-query-api/use-update-competition";
import { adminCompetitionFormSchema } from "@admin/admin-competition/schemas/admin-competition-schema";

import { useZodForm } from "@shared/hooks/use-zod-form";

interface IAdminCompetitionEditModal {
  competition: ICompetition;
  onClose: () => void;
}

export const AdminCompetitionEditModal = ({ competition, onClose }: IAdminCompetitionEditModal) => {
  //SECTION HOOK호출 영역
  const { mutateAsync: updateCompetition, isPending: isUpdating } = useUpdateCompetition();
  const { data: competitionTypes = [] } = useGetAllCompetitionTypes();
  const { data: seasons = [] } = useGetAllSeasons();
  const { values, errors, setValue, validate } = useZodForm(adminCompetitionFormSchema, {
    competitionTypeName: competition.name,
    season: competition.season,
  });

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
  const handleUpdateCompetition = async () => {
    const parsed = validate();
    if (!parsed) return;

    // 고른 대회명이 목록에 없으면 기존 값을 유지한다 (비활성 대회는 목록에서 빠질 수 있다)
    const competitionTypeId =
      competitionTypes.find((type) => type.name === parsed.competitionTypeName)?.id ?? competition.competition_type_id;

    await updateCompetition({
      id: competition.id,
      competition_type_id: competitionTypeId,
      season: parsed.season,
    });
    onClose();
  };
  //!SECTION 메서드 영역

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-yds-b1 text-primary-100">대회 수정</h2>
      <div className="flex flex-col gap-4">
        <Field label="대회 종류" required error={errors.competitionTypeName}>
          <SelectBox selectBoxHook={typeSelectBox} size="full" label="대회 종류 선택" />
        </Field>
        <Field label="시즌" required error={errors.season}>
          <SelectBox selectBoxHook={seasonSelectBox} size="full" label="시즌 선택" />
        </Field>
      </div>
      <div className="mt-6 flex gap-2">
        <Button variant="outlined" color="primary" size="full" onClick={onClose}>
          취소
        </Button>
        <Button variant="fill" color="primary" size="full" onClick={handleUpdateCompetition} disabled={isUpdating}>
          {isUpdating ? "수정 중..." : "수정"}
        </Button>
      </div>
    </div>
  );
};
