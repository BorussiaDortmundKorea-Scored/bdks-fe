// src/shared/components/LogoutButton.tsx
import React from "react";
import { useAuth } from "../contexts/AuthContext";

const LogoutButton: React.FC = () => {
  const { signOut, profile } = useAuth();

  const handleLogout = async () => {
    try {
      await signOut();
    } catch (error) {
      alert("로그아웃 중 오류가 발생했습니다.");
    }
  };

  const getUserDisplayName = () => {
    if (!profile) return "사용자";

    // 카카오 사용자 정보 표시
    return profile.nickname || "사용자";
  };

  return (
    <div className="flex items-center gap-4">
      <div className="text-sm text-gray-600">
        <span className="font-medium">{getUserDisplayName()}님</span>
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
