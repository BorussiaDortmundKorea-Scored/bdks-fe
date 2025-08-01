// src/shared/components/KakaoLoginButton.tsx
import React from "react";
import useKakaoLogin from "@auth/hooks/useKakaoLogin";

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
      className="bg-yellow-400 hover:bg-yellow-500 disabled:bg-gray-300 text-black font-bold py-2 px-4 rounded flex items-center justify-center gap-2 transition-colors w-full"
      aria-label="카카오로 로그인"
    >
      {isLoading ? (
        <span>로그인 중...</span>
      ) : (
        <>
          <span>카카오로 로그인</span>
        </>
      )}
    </button>
  );
};

export default KakaoLoginButton;
