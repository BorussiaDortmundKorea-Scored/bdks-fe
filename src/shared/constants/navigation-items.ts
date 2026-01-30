/**
 * 작성자: KYD
 * 기능: 네비게이션 아이템 상수 정의
 * 프로세스 설명: 메뉴 버튼과 하단 네비게이션 바에서 공통으로 사용하는 네비게이션 아이템 정의
 */
import type { LucideIcon } from "lucide-react";

import { Coffee, Home, LogOut, Settings, User } from "lucide-react";

import { ROUTES } from "./routes";

export type NavigationItemType = "top-menu" | "bottom-nav-bar";

export interface NavigationItemDeps {
  navigate: (path: string) => void;
  signOut: () => Promise<void>;
}

// Factory Pattern을 활용하여 네비게이션 아이템 생성
export interface NavigationItem {
  id: string;
  icon: LucideIcon;
  path?: string;
  label?: string;
  type: NavigationItemType;
  requiresAdmin?: boolean;
  onClick: (deps: NavigationItemDeps) => () => void;
}

//SECTION 리렌더링이 불필요한영역: 매직넘버, 문자열, 상수
export const NAVIGATION_ITEMS: NavigationItem[] = [
  {
    id: "dashboard",
    icon: Home,
    path: ROUTES.DASHBOARD,
    label: "대시보드",
    type: "bottom-nav-bar",
    onClick: (deps) => () => {
      deps.navigate(ROUTES.DASHBOARD);
    },
  },
  {
    id: "myInfo-bottom",
    icon: User,
    path: ROUTES.MY_INFO,
    label: "내 정보",
    type: "bottom-nav-bar",
    onClick: (deps) => () => {
      deps.navigate(ROUTES.MY_INFO);
    },
  },
  {
    id: "naverCafe-bottom",
    icon: Coffee,
    path: ROUTES.NAVER_CAFE,
    label: "네이버 카페 바로가기",
    type: "bottom-nav-bar",
    onClick: () => () => {
      window.open(ROUTES.NAVER_CAFE, "_blank");
    },
  },
  {
    id: "admin-top",
    icon: Settings,
    path: ROUTES.ADMIN_DASHBOARD,
    label: "관리자 페이지 이동하기",
    type: "top-menu",
    requiresAdmin: true,
    onClick: (deps) => () => {
      deps.navigate(ROUTES.ADMIN_DASHBOARD);
    },
  },
  {
    id: "logout",
    icon: LogOut,
    label: "로그아웃 하기",
    type: "top-menu",
    onClick: (deps) => async () => {
      try {
        await deps.signOut();
      } catch {
        alert("로그아웃 중 오류가 발생했습니다.");
      }
    },
  },
];
//!SECTION 리렌더링이 불필요한영역: 매직넘버, 문자열, 상수
