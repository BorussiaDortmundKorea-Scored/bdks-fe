/**
 * 작성자: KYD
 * 기능: 선수 수정 모달 컴포넌트
 * 프로세스 설명: 선수 수정 폼을 모달로 표시. 검증 실패 사유는 입력 밑에 인라인으로 보여준다
 */
import { Button, Field, Input, NumberInput } from "@youngduck/yd-ui";

import type { IPlayer } from "@admin/admin-player/api/admin-player-api";
import { useUpdatePlayer } from "@admin/admin-player/api/react-query-api/use-update-player";
import {
  JERSEY_NUMBER_MAX,
  JERSEY_NUMBER_MIN,
  adminPlayerFormSchema,
} from "@admin/admin-player/schemas/admin-player-schema";
import { buildPlayerImageUrls, extractPlayerImageName } from "@admin/admin-player/utils/player-image-utils";

import { useZodForm } from "@shared/hooks/use-zod-form";

interface IAdminPlayerEditModal {
  player: IPlayer;
  onClose: () => void;
}

export const AdminPlayerEditModal = ({ player, onClose }: IAdminPlayerEditModal) => {
  //SECTION HOOK호출 영역
  const { mutateAsync: updatePlayer, isPending: isUpdating } = useUpdatePlayer();
  // 모달은 행마다 새로 마운트되므로 초기값을 props 에서 바로 만든다
  const { values, errors, setValue, reset, validate } = useZodForm(adminPlayerFormSchema, {
    name: player.name,
    korean_name: player.korean_name || "",
    jersey_number: player.jersey_number?.toString() || "",
    nationality: player.nationality || "",
    image_name: extractPlayerImageName(player.full_profile_image_url || player.head_profile_image_url),
  });
  //!SECTION HOOK호출 영역

  //SECTION 메서드 영역
  const handleUpdatePlayer = async () => {
    const parsed = validate();
    if (!parsed) return;

    const { full_profile_image_url, head_profile_image_url } = buildPlayerImageUrls(parsed.image_name);
    await updatePlayer({
      id: player.id,
      name: parsed.name,
      korean_name: parsed.korean_name || undefined,
      jersey_number: parsed.jersey_number ? parseInt(parsed.jersey_number) : undefined,
      nationality: parsed.nationality || undefined,
      full_profile_image_url: full_profile_image_url || undefined,
      head_profile_image_url: head_profile_image_url || undefined,
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
      <h2 className="text-yds-b1 text-primary-100">선수 수정</h2>
      <div className="flex flex-col gap-4">
        <Field label="이름" required error={errors.name}>
          <Input
            type="text"
            value={values.name}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setValue("name", e.target.value)}
            placeholder="선수 이름을 입력하세요"
            size="full"
            color="primary-100"
          />
        </Field>
        <Field label="한국어 이름" error={errors.korean_name}>
          <Input
            type="text"
            value={values.korean_name}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setValue("korean_name", e.target.value)}
            placeholder="한국어 이름을 입력하세요"
            size="full"
            color="primary-100"
          />
        </Field>
        <Field label="등번호" error={errors.jersey_number}>
          <NumberInput
            value={values.jersey_number}
            onValueChange={(value: string) => setValue("jersey_number", value)}
            placeholder="등번호를 입력하세요"
            size="full"
            min={JERSEY_NUMBER_MIN}
            max={JERSEY_NUMBER_MAX}
            align="left"
          />
        </Field>
        <Field label="국적" error={errors.nationality}>
          <Input
            type="text"
            value={values.nationality}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setValue("nationality", e.target.value)}
            placeholder="국적을 입력하세요"
            size="full"
            color="primary-100"
          />
        </Field>
        <Field label="이미지명" error={errors.image_name}>
          <Input
            type="text"
            value={values.image_name}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setValue("image_name", e.target.value)}
            placeholder="예: meyer (확장자 생략 시 .png)"
            size="full"
            color="primary-100"
          />
        </Field>

        <div className="mt-6 flex gap-2">
          <Button variant="outlined" color="primary" size="full" onClick={handleClose}>
            취소
          </Button>
          <Button variant="fill" color="primary" size="full" onClick={handleUpdatePlayer} disabled={isUpdating}>
            {isUpdating ? "수정 중..." : "수정"}
          </Button>
        </div>
      </div>
    </div>
  );
};
