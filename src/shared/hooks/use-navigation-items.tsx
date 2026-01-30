/**
 * 작성자: KYD
 * 기능: 네비게이션 아이템 필터링 및 처리 훅
 * 프로세스 설명: 타입별로 네비게이션 아이템을 필터링하고 클릭 핸들러를 추가
 */
import { useLocation, useNavigate } from "react-router-dom";

import type { LucideIcon } from "lucide-react";

import { useAuth } from "@auth/contexts/AuthContext";

import { NAVIGATION_ITEMS, type NavigationItemType } from "@shared/constants/navigation-items";
import { ROUTES } from "@shared/constants/routes";

interface ProcessedNavigationItem {
  id: string;
  icon: LucideIcon;
  path?: string;
  label?: string;
  onClick: () => void;
  isActive?: boolean;
}

export const useNavigationItems = (type: NavigationItemType) => {
  //SECTION HOOK호출 영역
  const navigate = useNavigate();
  const location = useLocation();
  const { profile, signOut } = useAuth();
  const isAdmin = Boolean(profile?.is_admin);
  //!SECTION HOOK호출 영역

  //SECTION 메서드 영역
  const isActive = (path?: string) => {
    if (!path) return false;
    if (path === ROUTES.ADMIN_DASHBOARD) {
      return location.pathname.startsWith("/admin");
    }
    return location.pathname === path;
  };
  //!SECTION 메서드 영역

  //SECTION 상태값 영역
  const filteredItems = NAVIGATION_ITEMS.filter((item) => {
    // 타입 필터링: 해당 타입과 일치하는 경우만
    if (item.type !== type) {
      return false;
    }

    // 관리자 권한 필터링
    if (item.requiresAdmin && !isAdmin) {
      return false;
    }

    return true;
  });

  const processedItems: ProcessedNavigationItem[] = filteredItems.map((item): ProcessedNavigationItem => ({
    id: item.id,
    icon: item.icon,
    path: item.path,
    label: item.label,
    isActive: item.path ? isActive(item.path) : false,
    onClick: item.onClick({ navigate, signOut }),
  }));
  //!SECTION 상태값 영역

  return {
    items: processedItems,
  };
};
