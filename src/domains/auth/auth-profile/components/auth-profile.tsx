/**
 * 작성자: KYD
 * 기능:
 * 프로세스 설명: 프로세스 복잡시 노션링크 첨부권장
 */
import React from "react";
import { useState } from "react";

import { useCreateAuthProfile } from "../api/react-query-api/use-create-auth-profile";
import { Button, Input } from "@youngduck/yd-ui";

import LayoutWithHeaderFooter from "@shared/provider/layout-with-header-footer";

const AuthProfile = () => {
  //SECTION HOOK호출 영역
  const [nickname, setNickname] = useState("");
  const { mutateAsync: createAuthProfile, isPending: isCreateAuthProfileLoading } = useCreateAuthProfile();

  const trimNickname = (nickname: string) => {
    return nickname.trim();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedNickname = trimNickname(nickname);
    await createAuthProfile({
      nickname: trimmedNickname,
    });
  };
  //!SECTION HOOK호출 영역

  //SECTION 상태값 영역

  //!SECTION 상태값 영역

  //SECTION 메서드 영역

  //!SECTION 메서드 영역

  return (
    <>
      <form className="w-full" onSubmit={handleSubmit}>
        <LayoutWithHeaderFooter>
          <label htmlFor="nickname" className="text-primary-100 flex flex-col gap-2">
            <p className="text-yds-s2">사용할 닉네임을 설정해 주세요.</p>
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
          {/* <SelectBox size="full" selectBoxHook={genderSelectHook} /> */}
        </LayoutWithHeaderFooter>
        <div className="flex h-auto w-full items-center justify-center">
          <Button size="full" onClick={handleSubmit} disabled={isCreateAuthProfileLoading}>
            닉네임 설정
          </Button>
        </div>
      </form>
    </>
  );
};

export default AuthProfile;
