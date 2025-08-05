// src/shared/components/AnonymousLoginButton.tsx
import React from "react";
import useAnonymousLogin from "@auth/hooks/useAnonymousLogin";
import { Button } from "@youngduck/yd-ui";
const AnonymousLoginButton: React.FC = () => {
  const { signinAnonymously, isLoading } = useAnonymousLogin();

  const handleAnonymousLogin = async () => {
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
