import { MemoryRouter } from "react-router-dom";

import LoginPage from "./login-page";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

// QueryClient 생성
const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

// 외부 의존성 모킹
vi.mock("@auth/components/kakao-login-button", () => ({
  default: () => <div data-testid="kakao-login-button">카카오 로그인</div>,
}));

vi.mock("@auth/components/anonymous-login-button", () => ({
  default: () => <div data-testid="anonymous-login-button">익명 로그인</div>,
}));

vi.mock("@shared/components/player-rating-rotator", () => ({
  default: () => <div data-testid="player-rating-rotator">플레이어 평점</div>,
}));

describe("로그인 페이지", () => {
  const renderWithQueryClient = (component: React.ReactElement) => {
    const queryClient = createTestQueryClient();
    return render(
      <MemoryRouter>
        <QueryClientProvider client={queryClient}>{component}</QueryClientProvider>
      </MemoryRouter>,
    );
  };

  it("메인 제목이 렌더링되어야 한다", async () => {
    renderWithQueryClient(<LoginPage />);

    screen.debug();
    await screen.findByText("보돌코 스코어드");
    expect(screen.getByText("보돌코 스코어드")).toBeInTheDocument();
    screen.debug();
  });

  it("보돌코 스타디움 이미지가 렌더링되어야 한다", () => {
    renderWithQueryClient(<LoginPage />);

    const logoImage = screen.getByAltText("Dortmund Logo");
    expect(logoImage).toBeInTheDocument();
    expect(logoImage).toHaveAttribute("src");
  });

  it("저작권 고지문이 렌더링되어야 한다", () => {
    renderWithQueryClient(<LoginPage />);

    expect(screen.getByText(/도르트문트 팬을 위해 비영리적 목적으로 제작되었으며/)).toBeInTheDocument();
    expect(screen.getByText(/저작권 문제 발생 시 어플리케이션이 삭제될 수 있습니다/)).toBeInTheDocument();
  });

  it("로그인 버튼들이 올바른 순서로 렌더링되어야 한다", () => {
    renderWithQueryClient(<LoginPage />);

    const kakaoButton = screen.getByTestId("kakao-login-button");
    const anonymousButton = screen.getByTestId("anonymous-login-button");

    // 카카오 로그인 버튼이 익명 로그인 버튼보다 먼저 렌더링되는지 확인
    expect(kakaoButton.compareDocumentPosition(anonymousButton) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
  });
});
