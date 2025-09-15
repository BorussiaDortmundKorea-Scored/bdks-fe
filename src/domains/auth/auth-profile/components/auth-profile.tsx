/**
 * 작성자: KYD
 * 기능:
 * 프로세스 설명: 프로세스 복잡시 노션링크 첨부권장
 */
import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { Button, Input } from "@youngduck/yd-ui";

import { useAuth } from "@auth/contexts/AuthContext";

import { supabase } from "@shared/api/config/supabaseClient";
import LayoutWithHeaderFooter from "@shared/provider/layout-with-header-footer";

interface IAuthProfile {}

const AuthProfile: React.FC<IAuthProfile> = () => {
  //SECTION HOOK호출 영역
  const [nickname, setNickname] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nickname.trim()) {
      setError("닉네임을 입력해주세요.");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const { error } = await supabase.from("profiles").insert({
        id: user?.id,
        nickname: nickname.trim(),
      });

      if (error) {
        if (error.code === "23505") {
          setError("이미 사용 중인 닉네임입니다.");
        } else {
          setError("닉네임 설정 중 오류가 발생했습니다.");
        }
        return;
      }
      // 대시보드로 이동
      navigate("/dashboard", { replace: true });
    } catch (err) {
      setError("닉네임 설정 중 오류가 발생했습니다.");
    } finally {
      setIsLoading(false);
    }
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
            <p className="text-yds-b2">※ 일회용 로그인의 경우 닉네임을 설정 할 수 없어요.</p>
          </label>
          <Input
            id="nickname"
            name="nickname"
            type="text"
            required
            color="primary-100"
            size="full"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            placeholder="닉네임을 입력하세요"
            disabled={isLoading}
          />
          {error && <div className="text-center text-sm text-red-600">{error}</div>}
        </LayoutWithHeaderFooter>
        <div className="flex h-auto w-full items-center justify-center">
          <Button size="full" onClick={handleSubmit} disabled={isLoading}>
            닉네임 설정
          </Button>
        </div>
      </form>
    </>
  );
};

export default AuthProfile;
