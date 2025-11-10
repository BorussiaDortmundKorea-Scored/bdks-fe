// src/shared/components/KakaoLoginButton.tsx
import React from "react";

import useKakaoLogin from "@auth/hooks/useKakaoLogin";

import { SUPABASE_STORAGE_URL } from "@shared/constants/supabse-storage";

const KAKAO_LOGIN_BUTTON_IMAGE = `${SUPABASE_STORAGE_URL}/asset//kakao_login_logo.png`;

const KakaoLoginButton: React.FC = () => {
  const { signinWithKakao, isLoading } = useKakaoLogin();

  const handleKakaoLogin = async () => {
    const result = await signinWithKakao();

    if (!result.success) {
      alert(result.error);
    }
    // 성공 시 리다이렉트되므로 여기서는 별도 처리 불필요
  };

  return (
    <button
      onClick={handleKakaoLogin}
      disabled={isLoading}
      className="yds-button-typography gap-2 bg-[#FEE500]"
      aria-label="카카오로 로그인"
    >
      {isLoading ? (
        <span>로그인 중...</span>
      ) : (
        <>
          <img src={KAKAO_LOGIN_BUTTON_IMAGE} alt="Kakao Login Button" className="h-6 w-6" />
          <span>카카오 로그인</span>
        </>
      )}
    </button>
  );
};

export default KakaoLoginButton;
