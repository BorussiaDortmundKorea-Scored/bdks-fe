// src/shared/components/LogoutButton.tsx
import React from "react";

import { LogOut } from "lucide-react";

const LogoutButton: React.FC = () => {
  return <LogOut size={24} className="text-primary-100 cursor-pointer" aria-label="로그아웃" />;
};

export default LogoutButton;
