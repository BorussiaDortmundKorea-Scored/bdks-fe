import { act, renderHook } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";

import { MATCH_VIEW_FILTER_STORAGE_KEY, useMatchViewFilter } from "@admin/admin-match/hooks/use-match-view-filter";

describe("useMatchViewFilter", () => {
  afterEach(() => {
    sessionStorage.clear();
  });

  it("저장된 값이 없으면 예정(upcoming)으로 시작한다", () => {
    const { result } = renderHook(() => useMatchViewFilter());
    expect(result.current[0]).toBe("upcoming");
  });

  it("바꾼 필터를 sessionStorage 에 남겨 다시 마운트해도 유지된다", () => {
    const { result, unmount } = renderHook(() => useMatchViewFilter());
    act(() => result.current[1]("past"));
    expect(sessionStorage.getItem(MATCH_VIEW_FILTER_STORAGE_KEY)).toBe("past");
    unmount();

    const { result: remounted } = renderHook(() => useMatchViewFilter());
    expect(remounted.current[0]).toBe("past");
  });

  it("알 수 없는 값이 저장돼 있으면 기본값으로 시작한다", () => {
    sessionStorage.setItem(MATCH_VIEW_FILTER_STORAGE_KEY, "today-and-future");
    const { result } = renderHook(() => useMatchViewFilter());
    expect(result.current[0]).toBe("upcoming");
  });
});
