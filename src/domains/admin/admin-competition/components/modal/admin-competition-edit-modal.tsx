/**
 * 작성자: KYD
 * 기능: 대회 수정 모달 컴포넌트
 * 프로세스 설명: 대회 수정 폼을 모달로 표시
 */
import { useEffect, useState } from "react";

import { Button, Input } from "@youngduck/yd-ui";

import type { ICompetition } from "@admin/admin-competition/api/admin-competition-api";
import { useUpdateCompetition } from "@admin/admin-competition/api/react-query-api/use-update-competition";

interface IAdminCompetitionEditModal {
  competition: ICompetition;
  onClose: () => void;
}

export const AdminCompetitionEditModal = ({ competition, onClose }: IAdminCompetitionEditModal) => {
  //SECTION HOOK호출 영역
  const { mutateAsync: updateCompetition, isPending: isUpdating } = useUpdateCompetition();
  //!SECTION HOOK호출 영역

  //SECTION 상태값 영역
  const [formData, setFormData] = useState({
    name: "",
    season: "",
  });
  //!SECTION 상태값 영역

  //SECTION 메서드 영역
  useEffect(() => {
    setFormData({
      name: competition.name,
      season: competition.season,
    });
  }, [competition]);

  const handleUpdateCompetition = async () => {
    await updateCompetition({
      id: competition.id,
      name: formData.name || undefined,
      season: formData.season || undefined,
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
      <h2 className="text-yds-b1 text-primary-100">대회 수정</h2>
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
          onClick={handleUpdateCompetition}
          disabled={!formData.name || !formData.season || isUpdating}
        >
          {isUpdating ? "수정 중..." : "수정"}
        </Button>
      </div>
    </div>
  );
};

