/**
 * 작성자: KYD
 * 기능: 대회 추가 모달 컴포넌트
 * 프로세스 설명: 대회 추가 폼을 모달로 표시
 */
import { useState } from "react";

import { Button, Input } from "@youngduck/yd-ui";

import { useCreateCompetition } from "@admin/admin-competition/api/react-query-api/use-create-competition";

interface IAdminCompetitionAddModal {
  onClose: () => void;
}

export const AdminCompetitionAddModal = ({ onClose }: IAdminCompetitionAddModal) => {
  //SECTION HOOK호출 영역
  const { mutateAsync: createCompetition, isPending: isCreating } = useCreateCompetition();
  //!SECTION HOOK호출 영역

  //SECTION 상태값 영역
  const [formData, setFormData] = useState({
    name: "",
    season: "",
  });
  //!SECTION 상태값 영역

  //SECTION 메서드 영역
  const handleCreateCompetition = async () => {
    await createCompetition({
      name: formData.name,
      season: formData.season,
    });
    handleClose();
  };

  const handleClose = () => {
    setFormData({
      name: "",
      season: "",
    });
    onClose();
  };
  //!SECTION 메서드 영역

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-yds-b1 text-primary-100">새 대회 추가</h2>
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <label className="text-yds-b1 text-primary-100">대회명</label>
          <Input
            type="text"
            value={formData.name}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setFormData({ ...formData, name: e.target.value })
            }
            placeholder="대회명을 입력하세요"
            size="full"
            color="primary-100"
          />
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-yds-b1 text-primary-100">시즌</label>
          <Input
            type="text"
            value={formData.season}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setFormData({ ...formData, season: e.target.value })
            }
            placeholder="시즌을 입력하세요"
            size="full"
            color="primary-100"
          />
        </div>
      </div>
      <div className="mt-6 flex gap-2">
        <Button variant="outlined" color="primary" size="full" onClick={handleClose}>
          취소
        </Button>
        <Button
          variant="fill"
          color="primary"
          size="full"
          onClick={handleCreateCompetition}
          disabled={!formData.name || !formData.season || isCreating}
        >
          {isCreating ? "추가 중..." : "추가"}
        </Button>
      </div>
    </div>
  );
};

