/**
 * 작성자: KYD
 * 기능: 회원가입 프로필 설정 - 닉네임, 최애선수
 */
import React, { useMemo, useState } from "react";

import { Button, Input, SelectBox, useSelectBox } from "@youngduck/yd-ui";

import { useGetAllPlayersSuspense } from "@admin/admin-player/api/react-query-api/use-get-all-players-suspense";

import { useCreateAuthProfile } from "../api/react-query-api/use-create-auth-profile";

import LayoutWithHeaderFooter from "@shared/provider/layout-with-header-footer";

const AuthProfile = () => {
  //SECTION HOOK호출 영역
  const { data: players } = useGetAllPlayersSuspense();
  const { mutateAsync: createAuthProfile, isPending: isCreateAuthProfileLoading } = useCreateAuthProfile();
  //!SECTION HOOK호출 영역

  //SECTION 상태값 영역
  const [nickname, setNickname] = useState("");

  const playerOptions = useMemo(() => players.map((p) => ({ label: p.id, value: p.korean_name || p.name })), [players]);

  const playerSelectHook = useSelectBox({
    options: playerOptions,
    search: true,
  });
  //!SECTION 상태값 영역

  //SECTION 메서드 영역
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedNickname = nickname.trim();
    await createAuthProfile({
      nickname: trimmedNickname,
      favorite_player: playerSelectHook.label || undefined,
    });
  };
  //!SECTION 메서드 영역

  return (
    <>
      <form className="w-full" onSubmit={handleSubmit}>
        <LayoutWithHeaderFooter>
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-2">
              <label htmlFor="nickname" className="text-yds-s2 text-primary-100">
                사용할 닉네임
              </label>
              <Input
                id="nickname"
                name="nickname"
                type="text"
                required
                color="primary-100"
                size="full"
                value={nickname}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNickname(e.target.value)}
                placeholder="닉네임을 입력하세요"
                disabled={isCreateAuthProfileLoading}
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-yds-s2 text-primary-100">최애 선수</label>
              <SelectBox size="full" selectBoxHook={playerSelectHook} />
            </div>
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
