/**
 * 작성자: KYD
 * 기능: 프로필 수정 컴포넌트 - 닉네임, 좋아하는 선수 수정
 */
import React, { useMemo, useState } from "react";

import { Button, Input, SelectBox, useSelectBox } from "@youngduck/yd-ui";

import { useGetAllPlayersSuspense } from "@admin/admin-player/api/react-query-api/use-get-all-players-suspense";

import { useUpdateProfile } from "@auth/auth-info/auth-info-edit-profile/api/react-query-api/use-update-profile";
import { useAuth } from "@auth/contexts/AuthContext";

import LayoutWithHeaderFooter from "@shared/provider/layout-with-header-footer";

const AuthInfoEditProfile = () => {
  //SECTION HOOK호출 영역
  const { profile } = useAuth();
  const { data: players } = useGetAllPlayersSuspense();
  const { mutateAsync: updateProfile, isPending } = useUpdateProfile();
  //!SECTION HOOK호출 영역

  //SECTION 상태값 영역
  const [nickname, setNickname] = useState(profile?.nickname || "");

  const playerOptions = useMemo(() => players.map((p) => ({ label: p.id, value: p.korean_name || p.name })), [players]);

  const currentPlayerName = useMemo(() => {
    if (!profile?.favorite_player) return undefined;
    const found = players.find((p) => p.id === profile.favorite_player);
    return found?.korean_name || found?.name || undefined;
  }, [players, profile?.favorite_player]);

  const playerSelectHook = useSelectBox({
    options: playerOptions,
    search: true,
    defaultValue: currentPlayerName,
  });
  //!SECTION 상태값 영역

  //SECTION 메서드 영역
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedNickname = nickname.trim();
    await updateProfile({
      nickname: trimmedNickname,
      favorite_player: playerSelectHook.label || undefined,
    });
  };
  //!SECTION 메서드 영역

  return (
    <form className="w-full" onSubmit={handleSubmit}>
      <LayoutWithHeaderFooter>
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <label htmlFor="nickname" className="text-yds-s2 text-primary-100">
              닉네임
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
              disabled={isPending}
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-yds-s2 text-primary-100">최애 선수</label>
            <SelectBox size="full" selectBoxHook={playerSelectHook} />
          </div>
        </div>
      </LayoutWithHeaderFooter>
      <div className="flex h-auto w-full items-center justify-center">
        <Button size="full" onClick={handleSubmit} disabled={isPending}>
          {isPending ? "수정 중..." : "프로필 수정"}
        </Button>
      </div>
    </form>
  );
};

export default AuthInfoEditProfile;
