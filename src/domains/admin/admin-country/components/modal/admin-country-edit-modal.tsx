/**
 * 작성자: KYD
 * 기능: 국가 수정 모달 컴포넌트
 * 프로세스 설명: 국가명을 수정
 */
import { useState } from "react";

import { Button, Input } from "@youngduck/yd-ui";

import type { ICountry } from "@admin/admin-country/api/admin-country-api";
import { useUpdateCountry } from "@admin/admin-country/api/react-query-api/use-update-country";

interface IAdminCountryEditModal {
  country: ICountry;
  onClose: () => void;
}

export const AdminCountryEditModal = ({ country, onClose }: IAdminCountryEditModal) => {
  //SECTION HOOK호출 영역
  const { mutateAsync: updateCountry, isPending: isUpdating } = useUpdateCountry();
  //!SECTION HOOK호출 영역

  //SECTION 상태값 영역
  const [name, setName] = useState(country.name);
  //!SECTION 상태값 영역

  //SECTION 메서드 영역
  const handleUpdateCountry = async () => {
    await updateCountry({ id: country.id, name: name.trim() });
    onClose();
  };
  //!SECTION 메서드 영역

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-yds-b1 text-primary-100">국가 수정</h2>
      <div className="flex flex-col gap-2">
        <label className="text-yds-b1 text-primary-100">국가명</label>
        <Input
          type="text"
          value={name}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
          placeholder="예: 독일"
          size="full"
          color="primary-100"
        />
      </div>
      <div className="mt-6 flex gap-2">
        <Button variant="outlined" color="primary" size="full" onClick={onClose}>
          취소
        </Button>
        <Button
          variant="fill"
          color="primary"
          size="full"
          onClick={handleUpdateCountry}
          disabled={!name.trim() || isUpdating}
        >
          {isUpdating ? "수정 중..." : "수정"}
        </Button>
      </div>
    </div>
  );
};
