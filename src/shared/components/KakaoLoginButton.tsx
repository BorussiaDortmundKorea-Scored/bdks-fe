// src/shared/components/KakaoLoginButton.tsx
import React from "react";
import useKakaoLogin from "../hooks/useKakaoLogin";
import { useAuth } from "../contexts/AuthContext";

const KakaoLoginButton: React.FC = () => {
  const { signinWithKakao, isLoading } = useKakaoLogin();
  const { user } = useAuth();

  const handleKakaoLogin = async () => {
    const result = await signinWithKakao();

    if (!result.success) {
      alert(result.error);
    }
    // 성공 시 리다이렉트되므로 여기서는 별도 처리 불필요
  };

  // 로그인 페이지에서만 사용되므로 로그인 버튼만 표시
  if (user) {
    return null; // 이미 로그인된 상태면 버튼 숨김
  }

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
