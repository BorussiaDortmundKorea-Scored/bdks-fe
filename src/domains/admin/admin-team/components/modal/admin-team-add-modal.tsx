/**
 * 작성자: KYD
 * 기능: 팀 추가 모달 컴포넌트
 * 프로세스 설명: 팀 추가 폼을 모달로 표시
 */
import { useState } from "react";

import { Button, Input, SelectBox, useSelectBox } from "@youngduck/yd-ui";

import { useCreateTeam } from "@admin/admin-team/api/react-query-api/use-create-team";

// 국가 옵션 데이터. 하드코딩중
const countryOptions = [
  { label: "독일", value: "독일" },
  { label: "스페인", value: "스페인" },
  { label: "이탈리아", value: "이탈리아" },
  { label: "프랑스", value: "프랑스" },
  { label: "영국", value: "영국" },
  { label: "네덜란드", value: "네덜란드" },
  { label: "포르투갈", value: "포르투갈" },
];

interface IAdminTeamAddModal {
  onClose: () => void;
}

export const AdminTeamAddModal = ({ onClose }: IAdminTeamAddModal) => {
  //SECTION HOOK호출 영역
  const { mutateAsync: createTeam, isPending: isCreating } = useCreateTeam();

  const createCountrySelectHook = useSelectBox({
    options: countryOptions,
    search: true,
    defaultValue: "독일",
  });
  //!SECTION HOOK호출 영역

  //SECTION 상태값 영역
  const [formData, setFormData] = useState({
    name: "",
    logoImageUrl: "",
  });
  //!SECTION 상태값 영역

  //SECTION 메서드 영역
  const handleCreateTeam = async () => {
    await createTeam({
      name: formData.name,
      country: createCountrySelectHook.value,
      logoImageUrl: formData.logoImageUrl || undefined,
    });
    handleClose();
  };

  const handleClose = () => {
    setFormData({ name: "", logoImageUrl: "" });
    onClose();
  };
  //!SECTION 메서드 영역

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-yds-b1 text-primary-100">새 팀 추가</h2>
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <label className="text-yds-b1 text-primary-100">팀명</label>
          <Input
            type="text"
            value={formData.name}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setFormData({ ...formData, name: e.target.value })
            }
            placeholder="팀명을 입력하세요"
            size="full"
            color="primary-100"
          />
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-yds-b1 text-primary-100">로고 이미지 URL</label>
          <Input
            type="text"
            value={formData.logoImageUrl}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setFormData({ ...formData, logoImageUrl: e.target.value })
            }
            placeholder="예: https://... 또는 /storage/path"
            size="full"
            color="primary-100"
          />
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-yds-b1 text-primary-100">국가</label>
          <SelectBox size="full" selectBoxHook={createCountrySelectHook} />
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
          onClick={handleCreateTeam}
          disabled={!formData.name || isCreating}
        >
          {isCreating ? "추가 중..." : "추가"}
        </Button>
      </div>
    </div>
  );
};

