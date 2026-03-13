// src/shared/components/LogoutButton.tsx
import React from "react";

import { LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "@shared/constants/routes";
import { useAuth } from "@auth/contexts/AuthContext";

const LogoutButton: React.FC = () => {
  
  const { signOut } = useAuth();

  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut();
    navigate(ROUTES.LOGIN);
  };

  return <LogOut onClick={handleLogout} size={24} className="text-primary-100 cursor-pointer" aria-label="로그아웃" />;

};

export default LogoutButton;
