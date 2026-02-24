// src/shared/components/AnonymousLoginButton.tsx
import React from "react";
import useAnonymousLogin from "@auth/hooks/useAnonymousLogin";
import { Button } from "@youngduck/yd-ui";
import { GA4_CATEGORIES, GA4_EVENTS, GA4_LOGIN_METHODS } from "@shared/constants/analytics";
import { useGa4Event } from "@shared/hooks/use-ga4-event";

const AnonymousLoginButton: React.FC = () => {
  const { signinAnonymously, isLoading } = useAnonymousLogin();
  const { trackEvent } = useGa4Event();

  const handleAnonymousLogin = async () => {
    trackEvent({
      action: GA4_EVENTS.LOGIN_ATTEMPT,
      category: GA4_CATEGORIES.AUTH,
      label: GA4_LOGIN_METHODS.ANONYMOUS,
    });

    const result = await signinAnonymously();

    if (!result.success) {
      alert(result.error);
    }
    // 성공 시 AuthContext에서 자동으로 대시보드로 리다이렉트됨
  };

  return (
    <Button
      variant="outlined"
      size="full"
      onClick={handleAnonymousLogin}
      disabled={isLoading}
      aria-label="일회용 로그인"
    >
      {isLoading ? (
        <span>로그인 중...</span>
      ) : (
        <>
          <span>일회용 로그인</span>
        </>
      )}
    </Button>
  );
};

export default AnonymousLoginButton;
