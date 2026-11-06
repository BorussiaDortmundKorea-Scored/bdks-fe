/**
 * 작성자: KYD
 * 기능: 경기 관리 목록의 보기 필터 상태 훅 (sessionStorage 유지)
 * 프로세스 설명: 라인업 페이지에 갔다가 뒤로 오거나 새로고침해도 보던 필터가 유지되도록 sessionStorage 에 둔다.
 *              URL 이 아니라 sessionStorage 인 이유: 공유할 링크가 아니라 "이 탭에서 하던 작업 상태" 라서
 *              탭마다 따로 기억하고, 새 탭은 기본값(예정)에서 시작하게 한다.
 */
import { useState } from "react";

import { type MatchViewFilter, isMatchViewFilter } from "@admin/admin-match/utils/sort-matches-by-upcoming";

import { safeSessionStorage } from "@shared/utils/safe-session-storage";

export const MATCH_VIEW_FILTER_STORAGE_KEY = "bdks:admin-match:view";
const DEFAULT_MATCH_VIEW_FILTER: MatchViewFilter = "upcoming";

// 옛 값·손으로 고친 값이 들어 있어도 화면이 깨지지 않게 검증 후 기본값으로 되돌린다
const readStoredView = (): MatchViewFilter => {
  const stored = safeSessionStorage.get(MATCH_VIEW_FILTER_STORAGE_KEY);
  return isMatchViewFilter(stored) ? stored : DEFAULT_MATCH_VIEW_FILTER;
};

export const useMatchViewFilter = () => {
  const [view, setViewState] = useState<MatchViewFilter>(readStoredView);

  const setView = (next: MatchViewFilter) => {
    setViewState(next);
    safeSessionStorage.set(MATCH_VIEW_FILTER_STORAGE_KEY, next);
  };

  return [view, setView] as const;
};
