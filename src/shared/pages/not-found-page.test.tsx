import NotFoundPage from "./not-found-page";
import { fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { ROUTES } from "@shared/constants/routes";

describe("NotFoundPage 렌더링 테스트", () => {
  const originalLocation = window.location;

  beforeEach(() => {
    // window.location.href 할당 검증을 위해 mock으로 대체
    Object.defineProperty(window, "location", {
      configurable: true,
      value: { ...originalLocation, href: "" },
    });
  });

  afterEach(() => {
    Object.defineProperty(window, "location", {
      configurable: true,
      value: originalLocation,
    });
    vi.restoreAllMocks();
  });

  it("로고, 안내 문구, 두 개의 이동 버튼이 렌더링된다", () => {
    render(<NotFoundPage />);

    expect(screen.getByTestId("not-found-page")).toBeInTheDocument();
    expect(screen.getByAltText("보돌코 스코어드 로고")).toBeInTheDocument();
    expect(screen.getByText("페이지를 찾을 수 없습니다")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "홈으로 돌아가기" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "이전 페이지" })).toBeInTheDocument();
  });

  it("'홈으로 돌아가기' 클릭 시 대시보드 경로로 이동한다", () => {
    render(<NotFoundPage />);

    fireEvent.click(screen.getByRole("button", { name: "홈으로 돌아가기" }));

    expect(window.location.href).toBe(ROUTES.DASHBOARD);
  });

  it("'이전 페이지' 클릭 시 window.history.back이 호출된다", () => {
    const backSpy = vi.spyOn(window.history, "back").mockImplementation(() => {});

    render(<NotFoundPage />);

    fireEvent.click(screen.getByRole("button", { name: "이전 페이지" }));

    expect(backSpy).toHaveBeenCalledTimes(1);
  });
});
