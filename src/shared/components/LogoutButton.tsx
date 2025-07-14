// src/shared/components/LogoutButton.tsx
import React from "react";
import { useAuth } from "../contexts/AuthContext";

const LogoutButton: React.FC = () => {
  const { user, signOut } = useAuth();

  const handleLogout = async () => {
    try {
      await signOut();
    } catch (error) {
      alert("로그아웃 중 오류가 발생했습니다.");
    }
  };

  const getUserDisplayName = () => {
    if (!user) return "사용자";

    // 익명 사용자인지 확인
    if (user.is_anonymous) {
      return "익명 사용자";
    }

    // 카카오 사용자 정보 표시
    return user.email || user.user_metadata?.name || user.user_metadata?.full_name || "사용자";
  };

  const getUserType = () => {
    if (!user) return "";

    if (user.is_anonymous) {
      return "(익명)";
    }

    if (user.app_metadata?.provider === "kakao") {
      return "(카카오)";
    }

    return "";
  };

  if (!user) {
    return null;
  }

  return (
    <div className="flex items-center gap-4">
      <div className="text-sm text-gray-600">
        <span className="font-medium">{getUserDisplayName()}</span>
        <span className="ml-1 text-gray-400">{getUserType()}</span>
      </div>
      <button
        onClick={handleLogout}
        className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded transition-colors text-sm"
        aria-label="로그아웃"
      >
        로그아웃
      </button>
    </div>
  );
};

export default LogoutButton;
