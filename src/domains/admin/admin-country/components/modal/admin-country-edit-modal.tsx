/**
 * 작성자: KYD
 * 기능: 국가 수정 모달 컴포넌트
 * 프로세스 설명: 국가명을 수정. 검증 실패 사유는 입력 밑에 인라인으로 보여준다
 */
import { Button, Field, Input } from "@youngduck/yd-ui";

import type { ICountry } from "@admin/admin-country/api/admin-country-api";
import { useUpdateCountry } from "@admin/admin-country/api/react-query-api/use-update-country";
import { adminCountryFormSchema } from "@admin/admin-country/schemas/admin-country-schema";

import ModalFooter from "@shared/components/modal/modal-footer";
import ModalTitle from "@shared/components/modal/modal-title";
import { useZodForm } from "@shared/hooks/use-zod-form";

interface IAdminCountryEditModal {
  country: ICountry;
  onClose: () => void;
}

export const AdminCountryEditModal = ({ country, onClose }: IAdminCountryEditModal) => {
  //SECTION HOOK호출 영역
  const { mutateAsync: updateCountry, isPending: isUpdating } = useUpdateCountry();
  const { values, errors, setValue, validate } = useZodForm(adminCountryFormSchema, { name: country.name });
  //!SECTION HOOK호출 영역

  //SECTION 메서드 영역
  const handleUpdateCountry = async () => {
    const parsed = validate();
    if (!parsed) return;

    await updateCountry({ id: country.id, name: parsed.name });
    onClose();
  };
  //!SECTION 메서드 영역

  return (
    <div className="flex flex-col gap-4">
      <ModalTitle>국가 수정</ModalTitle>
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
      <ModalFooter>
        <Button variant="outlined" color="primary" size="full" onClick={onClose}>
          취소
        </Button>
        <Button variant="fill" color="primary" size="full" onClick={handleUpdateCountry} disabled={isUpdating}>
          {isUpdating ? "수정 중..." : "수정"}
        </Button>
      </ModalFooter>
    </div>
  );
};
