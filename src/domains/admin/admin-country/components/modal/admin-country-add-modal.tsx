/**
 * 작성자: KYD
 * 기능: 국가 추가 모달 컴포넌트
 * 프로세스 설명: 국가명을 입력해 국가를 등록. 검증 실패 사유는 입력 밑에 인라인으로 보여준다
 */
import { Button, Field, Input } from "@youngduck/yd-ui";

import { useCreateCountry } from "@admin/admin-country/api/react-query-api/use-create-country";
import {
  ADMIN_COUNTRY_FORM_INITIAL_VALUES,
  adminCountryFormSchema,
} from "@admin/admin-country/schemas/admin-country-schema";

import { useZodForm } from "@shared/hooks/use-zod-form";

interface IAdminCountryAddModal {
  onClose: () => void;
}

export const AdminCountryAddModal = ({ onClose }: IAdminCountryAddModal) => {
  //SECTION HOOK호출 영역
  const { mutateAsync: createCountry, isPending: isCreating } = useCreateCountry();
  const { values, errors, setValue, reset, validate } = useZodForm(
    adminCountryFormSchema,
    ADMIN_COUNTRY_FORM_INITIAL_VALUES,
  );
  //!SECTION HOOK호출 영역

  //SECTION 메서드 영역
  const handleCreateCountry = async () => {
    const parsed = validate();
    if (!parsed) return;

    await createCountry({ name: parsed.name });
    handleClose();
  };

  const handleClose = () => {
    reset();
    onClose();
  };
  //!SECTION 메서드 영역

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-yds-b1 text-primary-100">새 국가 추가</h2>
      <Field label="국가명" required error={errors.name}>
        <Input
          type="text"
          value={values.name}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setValue("name", e.target.value)}
          placeholder="예: 독일"
          size="full"
          color="primary-100"
        />
      </Field>
      <div className="mt-6 flex gap-2">
        <Button variant="outlined" color="primary" size="full" onClick={handleClose}>
          취소
        </Button>
        <Button variant="fill" color="primary" size="full" onClick={handleCreateCountry} disabled={isCreating}>
          {isCreating ? "추가 중..." : "추가"}
        </Button>
      </div>
    </div>
  );
};
