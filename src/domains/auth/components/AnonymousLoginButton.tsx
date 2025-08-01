// src/shared/components/AnonymousLoginButton.tsx
import React from "react";
import useAnonymousLogin from "@auth/hooks/useAnonymousLogin";

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
    <button
      onClick={handleAnonymousLogin}
      disabled={isLoading}
      className="bg-gray-600 hover:bg-gray-700 disabled:bg-gray-300 text-white font-bold py-2 px-4 rounded flex items-center justify-center gap-2 transition-colors w-full"
      aria-label="로그인 없이 이용하기"
    >
      {isLoading ? (
        <span>로그인 중...</span>
      ) : (
        <>
          <span>로그인 없이 이용하기</span>
        </>
      )}
    </button>
  );
};

export default AnonymousLoginButton;
