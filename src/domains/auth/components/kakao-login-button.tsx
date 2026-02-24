// src/shared/components/KakaoLoginButton.tsx
import React from "react";

import useKakaoLogin from "@auth/hooks/useKakaoLogin";

import { SUPABASE_STORAGE_URL } from "@shared/constants/supabse-storage";
import { GA4_CATEGORIES, GA4_EVENTS, GA4_LOGIN_METHODS } from "@shared/constants/analytics";
import { useGa4Event } from "@shared/hooks/use-ga4-event";

const KAKAO_LOGIN_BUTTON_IMAGE = `${SUPABASE_STORAGE_URL}/asset//kakao_login_logo.png`;

const KakaoLoginButton: React.FC = () => {
  const { signinWithKakao, isLoading } = useKakaoLogin();
  const { trackEvent } = useGa4Event();

  const handleKakaoLogin = async () => {
    trackEvent({
      action: GA4_EVENTS.LOGIN_ATTEMPT,
      category: GA4_CATEGORIES.AUTH,
      label: GA4_LOGIN_METHODS.KAKAO,
    });

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
      className="yds-button gap-2 bg-[#FEE500]"
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
