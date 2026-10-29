// src/shared/components/LogoutButton.tsx
import React from "react";
import { useNavigate } from "react-router-dom";

import { LogOut } from "lucide-react";

import { useAuth } from "@auth/contexts/AuthContext";

import { ROUTES } from "@shared/constants/routes";

const LogoutButton: React.FC = () => {
  const { signOut } = useAuth();

  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut();
    navigate(ROUTES.LOGIN);
  };

  return (
    <button onClick={handleLogout} aria-label="로그아웃" className="flex cursor-pointer">
      <LogOut size={24} className="text-primary-100" />
    </button>
  );
};

export default LogoutButton;
