/**
 * 작성자: KYD
 * 기능: 회원가입 프로필 설정 - 닉네임, 최애선수
 * 프로세스 설명: 빈 값·길이는 zod 로 제출 전에 거르고, 중복처럼 서버만 아는 실패는
 *                RPC 에러 코드를 받아 toast + 필드 밑 인라인으로 함께 보여준다.
 */
import React, { useMemo, useState } from "react";

import { Button, Field, Input, SelectBox, useSelectBox } from "@youngduck/yd-ui";

import { useGetAllPlayersSuspense } from "@admin/admin-player/api/react-query-api/use-get-all-players-suspense";

import { getCreateProfileErrorMessage, isNicknameFieldError } from "@auth/auth-profile/api/auth-profile-error";
import { useCreateAuthProfile } from "@auth/auth-profile/api/react-query-api/use-create-auth-profile";
import { nicknameSchema } from "@auth/auth-profile/schemas/auth-profile-schema";

import LayoutWithHeaderFooter from "@shared/provider/layout-with-header-footer";

const AuthProfile = () => {
  //SECTION HOOK호출 영역
  const { data: players } = useGetAllPlayersSuspense();
  const { mutateAsync: createAuthProfile, isPending: isCreateAuthProfileLoading } = useCreateAuthProfile();
  //!SECTION HOOK호출 영역

  //SECTION 상태값 영역
  const [nickname, setNickname] = useState("");
  const [nicknameError, setNicknameError] = useState<string>();

  const playerOptions = useMemo(() => players.map((p) => ({ label: p.id, value: p.korean_name || p.name })), [players]);

  const playerSelectHook = useSelectBox({
    options: playerOptions,
    search: true,
  });
  //!SECTION 상태값 영역

  //SECTION 메서드 영역
  const handleChangeNickname = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNickname(e.target.value);
    // 고치는 중에 이전 에러가 남아 있으면 무엇을 고쳐야 하는지 흐려진다
    setNicknameError(undefined);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const parsed = nicknameSchema.safeParse(nickname);
    if (!parsed.success) {
      setNicknameError(parsed.error.issues[0].message);
      return;
    }

    try {
      await createAuthProfile({
        nickname: parsed.data,
        favorite_player: playerSelectHook.label || undefined,
      });
    } catch (error) {
      // toast 는 mutation 의 onError 가 띄운다. 여기서는 필드 밑에 남는 안내만 맡는다
      if (isNicknameFieldError(error)) setNicknameError(getCreateProfileErrorMessage(error));
    }
  };
  //!SECTION 메서드 영역

  return (
    <>
      <form className="w-full" onSubmit={handleSubmit}>
        <LayoutWithHeaderFooter>
          <div className="flex flex-col gap-6">
            <Field label="사용할 닉네임" required error={nicknameError}>
              <Input
                name="nickname"
                type="text"
                color="primary-100"
                size="full"
                value={nickname}
                onChange={handleChangeNickname}
                placeholder="닉네임을 입력하세요"
                disabled={isCreateAuthProfileLoading}
              />
            </Field>
            <Field label="최애 선수">
              <SelectBox size="full" selectBoxHook={playerSelectHook} />
            </Field>
          </div>
        </LayoutWithHeaderFooter>
        <div className="flex h-auto w-full items-center justify-center">
          <Button size="full" onClick={handleSubmit} disabled={isCreateAuthProfileLoading}>
            {isCreateAuthProfileLoading ? "설정 중..." : "프로필 설정"}
          </Button>
        </div>
      </form>
    </>
  );
};

export default AuthProfile;
