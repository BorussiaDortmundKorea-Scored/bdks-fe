/**
 * 작성자: KYD
 * 기능: 선수 추가 모달 컴포넌트
 * 프로세스 설명: 선수 추가 폼을 모달로 표시
 */
import { useState } from "react";

import { Button, Input } from "@youngduck/yd-ui";

import { useCreatePlayer } from "@admin/admin-player/api/react-query-api/use-create-player";

interface IAdminPlayerAddModal {
  onClose: () => void;
}

export const AdminPlayerAddModal = ({ onClose }: IAdminPlayerAddModal) => {
  //SECTION HOOK호출 영역
  const { mutateAsync: createPlayer, isPending: isCreating } = useCreatePlayer();
  //!SECTION HOOK호출 영역

  //SECTION 상태값 영역
  const [formData, setFormData] = useState({
    name: "",
    korean_name: "",
    jersey_number: "",
    nationality: "",
    full_profile_image_url: "",
    head_profile_image_url: "",
  });
  //!SECTION 상태값 영역

  //SECTION 메서드 영역
  const handleCreatePlayer = async () => {
    await createPlayer({
      name: formData.name,
      korean_name: formData.korean_name || undefined,
      jersey_number: formData.jersey_number ? parseInt(formData.jersey_number) : undefined,
      nationality: formData.nationality || undefined,
      full_profile_image_url: formData.full_profile_image_url || undefined,
      head_profile_image_url: formData.head_profile_image_url || undefined,
    });
    handleClose();
  };

  const handleClose = () => {
    setFormData({
      name: "",
      korean_name: "",
      jersey_number: "",
      nationality: "",
      full_profile_image_url: "",
      head_profile_image_url: "",
    });
    onClose();
  };
  //!SECTION 메서드 영역

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-yds-b1 text-primary-100">새 선수 추가</h2>

      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <label className="text-yds-b1 text-primary-100">이름</label>
          <Input
            type="text"
            value={formData.name}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, name: e.target.value })}
            placeholder="선수 이름을 입력하세요"
            size="full"
            color="primary-100"
          />
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-yds-b1 text-primary-100">한국어 이름</label>
          <Input
            type="text"
            value={formData.korean_name}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setFormData({ ...formData, korean_name: e.target.value })
            }
            placeholder="한국어 이름을 입력하세요"
            size="full"
            color="primary-100"
          />
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-yds-b1 text-primary-100">등번호</label>
          <Input
            type="number"
            value={formData.jersey_number}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setFormData({ ...formData, jersey_number: e.target.value })
            }
            placeholder="등번호를 입력하세요"
            size="full"
            color="primary-100"
          />
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-yds-b1 text-primary-100">국적</label>
          <Input
            type="text"
            value={formData.nationality}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setFormData({ ...formData, nationality: e.target.value })
            }
            placeholder="국적을 입력하세요"
            size="full"
            color="primary-100"
          />
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-yds-b1 text-primary-100">전신 프로필 이미지 URL</label>
          <Input
            type="url"
            value={formData.full_profile_image_url}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setFormData({ ...formData, full_profile_image_url: e.target.value })
            }
            placeholder="전신 프로필 이미지 URL을 입력하세요"
            size="full"
            color="primary-100"
          />
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-yds-b1 text-primary-100">얼굴 프로필 이미지 URL</label>
          <Input
            type="url"
            value={formData.head_profile_image_url}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setFormData({ ...formData, head_profile_image_url: e.target.value })
            }
            placeholder="얼굴 프로필 이미지 URL을 입력하세요"
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
          onClick={handleCreatePlayer}
          disabled={!formData.name || isCreating}
        >
          {isCreating ? "추가 중..." : "추가"}
        </Button>
      </div>
    </div>
  );
};
