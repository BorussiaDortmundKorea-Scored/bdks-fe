/**
 * 작성자: KYD
 * 기능: 팀 추가 모달 컴포넌트
 * 프로세스 설명: 팀 추가 폼을 모달로 표시. 국가는 countries 마스터(관리자 국가 관리)에서 로드
 */
import { useMemo } from "react";

import { Button, Field, Input, SelectBox, useSelectBox } from "@youngduck/yd-ui";

import { useGetAllCountriesSuspense } from "@admin/admin-country/api/react-query-api/use-get-all-countries-suspense";
import { useCreateTeam } from "@admin/admin-team/api/react-query-api/use-create-team";
import { ADMIN_TEAM_FORM_INITIAL_VALUES, adminTeamFormSchema } from "@admin/admin-team/schemas/admin-team-schema";
import { buildTeamLogoUrl } from "@admin/admin-team/utils/team-logo-utils";

import { useZodForm } from "@shared/hooks/use-zod-form";

interface IAdminTeamAddModal {
  onClose: () => void;
}

export const AdminTeamAddModal = ({ onClose }: IAdminTeamAddModal) => {
  //SECTION HOOK호출 영역
  const { mutateAsync: createTeam, isPending: isCreating } = useCreateTeam();
  const { data: countries } = useGetAllCountriesSuspense();
  const { values, errors, setValue, reset, validate } = useZodForm(adminTeamFormSchema, ADMIN_TEAM_FORM_INITIAL_VALUES);

  // SelectBox 규칙: value=표시명, label=실제 id값
  const countryOptions = useMemo(
    () => countries.map((country) => ({ label: country.id, value: country.name })),
    [countries],
  );
  const createCountrySelectHook = useSelectBox({ options: countryOptions, search: true });
  //!SECTION HOOK호출 영역

  //SECTION 메서드 영역
  const handleCreateTeam = async () => {
    const parsed = validate();
    if (!parsed) return;

    await createTeam({
      name: parsed.name,
      country_id: createCountrySelectHook.label || null,
      logo_image_url: buildTeamLogoUrl(parsed.image_name) || undefined,
    });
    handleClose();
  };

  const handleClose = () => {
    reset();
    onClose();
  };
  //!SECTION 메서드 영역

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-yds-b1 text-primary-100">새 팀 추가</h2>
      <div className="flex flex-col gap-4">
        <Field label="팀명" required error={errors.name}>
          <Input
            type="text"
            value={values.name}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setValue("name", e.target.value)}
            placeholder="팀명을 입력하세요"
            size="full"
            color="primary-100"
          />
        </Field>
        <Field label="로고 이미지명" error={errors.image_name}>
          <Input
            type="text"
            value={values.image_name}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setValue("image_name", e.target.value)}
            placeholder="예: barcelona (확장자 생략 시 .png)"
            size="full"
            color="primary-100"
          />
        </Field>
        <Field label="국가">
          <SelectBox size="full" selectBoxHook={createCountrySelectHook} label="국가 선택" />
        </Field>
      </div>
      <div className="mt-6 flex gap-2">
        <Button variant="outlined" color="primary" size="full" onClick={handleClose}>
          취소
        </Button>
        <Button variant="fill" color="primary" size="full" onClick={handleCreateTeam} disabled={isCreating}>
          {isCreating ? "추가 중..." : "추가"}
        </Button>
      </div>
    </div>
  );
};
