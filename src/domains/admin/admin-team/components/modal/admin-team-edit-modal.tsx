/**
 * 작성자: KYD
 * 기능: 팀 수정 모달 컴포넌트
 * 프로세스 설명: 팀 수정 폼을 모달로 표시. 국가는 countries 마스터(관리자 국가 관리)에서 로드
 */
import { useEffect, useMemo } from "react";

import { Button, Field, Input, SelectBox, useSelectBox } from "@youngduck/yd-ui";

import { useGetAllCountriesSuspense } from "@admin/admin-country/api/react-query-api/use-get-all-countries-suspense";
import type { ITeam } from "@admin/admin-team/api/admin-team-api";
import { useUpdateTeam } from "@admin/admin-team/api/react-query-api/use-update-team";
import { adminTeamFormSchema } from "@admin/admin-team/schemas/admin-team-schema";
import { buildTeamLogoUrl, extractTeamLogoName } from "@admin/admin-team/utils/team-logo-utils";

import { useZodForm } from "@shared/hooks/use-zod-form";

interface IAdminTeamEditModal {
  team: ITeam;
  onClose: () => void;
}

export const AdminTeamEditModal = ({ team, onClose }: IAdminTeamEditModal) => {
  //SECTION HOOK호출 영역
  const { mutateAsync: updateTeam, isPending: isUpdating } = useUpdateTeam();
  const { data: countries } = useGetAllCountriesSuspense();
  // 모달은 행마다 새로 마운트되므로 초기값을 props 에서 바로 만든다
  const { values, errors, setValue, reset, validate } = useZodForm(adminTeamFormSchema, {
    name: team.name,
    image_name: extractTeamLogoName(team.logo_image_url),
  });

  // SelectBox 규칙: value=표시명, label=실제 id값
  const countryOptions = useMemo(
    () => countries.map((country) => ({ label: country.id, value: country.name })),
    [countries],
  );
  const editCountrySelectHook = useSelectBox({ options: countryOptions, search: true });
  //!SECTION HOOK호출 영역

  //SECTION 메서드 영역
  // SelectBox에 기존 국가 설정 (country_id로 매칭)
  useEffect(() => {
    if (!team.country_id) return;

    const countryOption = countryOptions.find((opt) => opt.label === team.country_id);
    if (countryOption) editCountrySelectHook.handleClickOption(countryOption);
  }, [team, countryOptions]);

  const handleUpdateTeam = async () => {
    const parsed = validate();
    if (!parsed) return;

    await updateTeam({
      id: team.id,
      name: parsed.name,
      country_id: editCountrySelectHook.label || null,
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
      <h2 className="text-yds-b1 text-primary-100">팀 수정</h2>
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
          <SelectBox size="full" selectBoxHook={editCountrySelectHook} label="국가 선택" />
        </Field>
      </div>
      <div className="mt-6 flex gap-2">
        <Button variant="outlined" color="primary" size="full" onClick={handleClose}>
          취소
        </Button>
        <Button variant="fill" color="primary" size="full" onClick={handleUpdateTeam} disabled={isUpdating}>
          {isUpdating ? "수정 중..." : "수정"}
        </Button>
      </div>
    </div>
  );
};
