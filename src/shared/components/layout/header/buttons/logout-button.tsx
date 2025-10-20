// src/shared/components/LogoutButton.tsx
import React from "react";

import { useAuth } from "../../../../../domains/auth/contexts/AuthContext";
import { LogOut } from "lucide-react";

const LogoutButton: React.FC = () => {
  const { signOut } = useAuth();

  const handleLogout = async () => {
    try {
      await signOut();
    } catch {
      alert("로그아웃 중 오류가 발생했습니다.");
    }
  };

  return (
    <LogOut
      size={24}
      className="text-primary-100 absolute left-1 cursor-pointer"
      onClick={handleLogout}
      aria-label="로그아웃"
    />
  );
};

export default LogoutButton;
