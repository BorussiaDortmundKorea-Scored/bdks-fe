/**
 * 작성자: KYD
 * 기능: 국가 추가 모달 컴포넌트
 * 프로세스 설명: 국가명을 입력해 국가를 등록
 */
import { useState } from "react";

import { Button, Input } from "@youngduck/yd-ui";

import { useCreateCountry } from "@admin/admin-country/api/react-query-api/use-create-country";

interface IAdminCountryAddModal {
  onClose: () => void;
}

export const AdminCountryAddModal = ({ onClose }: IAdminCountryAddModal) => {
  //SECTION HOOK호출 영역
  const { mutateAsync: createCountry, isPending: isCreating } = useCreateCountry();
  //!SECTION HOOK호출 영역

  //SECTION 상태값 영역
  const [name, setName] = useState("");
  //!SECTION 상태값 영역

  //SECTION 메서드 영역
  const handleCreateCountry = async () => {
    await createCountry({ name: name.trim() });
    handleClose();
  };

  const handleClose = () => {
    setName("");
    onClose();
  };
  //!SECTION 메서드 영역

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-yds-b1 text-primary-100">새 국가 추가</h2>
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
        <Button variant="outlined" color="primary" size="full" onClick={handleClose}>
          취소
        </Button>
        <Button
          variant="fill"
          color="primary"
          size="full"
          onClick={handleCreateCountry}
          disabled={!name.trim() || isCreating}
        >
          {isCreating ? "추가 중..." : "추가"}
        </Button>
      </div>
    </div>
  );
};
