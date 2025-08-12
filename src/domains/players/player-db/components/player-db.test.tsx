import { render, screen, waitFor, within } from "@testing-library/react";
import PlayerDb from "./player-db";
import { QueryClient } from "@tanstack/react-query";
import { QueryClientProvider } from "@tanstack/react-query";
import { MemoryRouter } from "react-router-dom";
import ReactQueryBoundary from "@shared/provider/react-query-boundary";
import AnimalListError from "@animals/components/animal-list/error/animal-list-error";
import { vi } from "vitest";
import PlayerDBDummy from "../mocks/player-db-dummy.json";

// 모킹 모듈 가져오기
const mockUseAuth = vi.fn();

vi.mock("@auth/contexts/AuthContext", () => ({
  useAuth: () => mockUseAuth(),
}));

// 테스트 헬퍼 함수들
const mockAnonymousUser = () => {
  mockUseAuth.mockReturnValue({
    user: {
      id: "익명id여",
      aud: "authenticated",
      role: "authenticated",
      email: "",
      phone: "",
      last_sign_in_at: "2025-08-12T16:05:55.199244225Z",
      app_metadata: {},
      user_metadata: {},
      identities: [],
      created_at: "2025-08-12T16:05:55.187667Z",
      updated_at: "2025-08-12T16:05:55.206288Z",
      is_anonymous: true,
    },
    session: null,
    signOut: vi.fn(),
  });
};

const mockKakaoUser = () => {
  mockUseAuth.mockReturnValue({
    user: {
      id: "카카오id여",
      aud: "authenticated",
      role: "authenticated",
      email: "user@example.com",
      phone: "",
      last_sign_in_at: "2025-08-12T15:30:12.620044774Z",
      app_metadata: {},
      user_metadata: {},
      identities: [],
      created_at: "2025-08-12T15:30:12.614313Z",
      updated_at: "2025-08-12T15:30:12.624367Z",
      is_anonymous: false,
    },
    session: null,
    signOut: vi.fn(),
  });
};

const renderWithQueryClient = (component: React.ReactElement) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });
  return render(
    <MemoryRouter>
      <QueryClientProvider client={queryClient}>
        <ReactQueryBoundary skeleton={<div>Loading...</div>} errorFallback={AnimalListError}>
          {component}
        </ReactQueryBoundary>
      </QueryClientProvider>
    </MemoryRouter>,
  );
};

describe("선수 누적평점 컴포넌트 렌더링 테스트", () => {
  beforeEach(() => {
    // 기본값: 익명 로그인 사용자
    mockAnonymousUser();
  });

  it("목데이터 21명의 선수이름을 볼 수 있어야 한다", async () => {
    renderWithQueryClient(<PlayerDb />);

    await waitFor(() => {
      expect(screen.queryByText("Loading...")).not.toBeInTheDocument();
    });

    screen.debug();

    const mockData = PlayerDBDummy;

    mockData.forEach((player) => {
      expect(screen.getByText(player.korean_name)).toBeInTheDocument();
    });
  });

  it("목데이터 21명중 전체평점,내평점 점수가 null인경우 각각 0점으로 나와야 한다", async () => {
    renderWithQueryClient(<PlayerDb />);

    await waitFor(() => {
      expect(screen.queryByText("Loading...")).not.toBeInTheDocument();
    });

    // screen.debug();

    const mockData = PlayerDBDummy;

    mockData.forEach((player) => {
      const playerElement = screen.getByText(player.korean_name).closest("li") as HTMLElement;
      // screen.debug(playerElement);

      if (player.overall_avg_rating_all === null) {
        const overallRatingElement = within(playerElement).getByTestId("overall-rating");
        expect(overallRatingElement.textContent).toBe("All : 0");
      } else {
        const overallRatingElement = within(playerElement).getByTestId("overall-rating");
        expect(overallRatingElement.textContent).toBe("All : " + String(player.overall_avg_rating_all));
      }

      if (player.overall_avg_rating_my === null) {
        const myRatingElement = within(playerElement).getByTestId("my-rating");

        expect(myRatingElement.textContent).toBe("My : 0");
      } else {
        const myRatingElement = within(playerElement).getByTestId("my-rating");

        expect(myRatingElement.textContent).toBe("My : " + String(player.overall_avg_rating_my));
      }
    });
  });

  it("이미지 렌더링 테스트", async () => {
    renderWithQueryClient(<PlayerDb />);

    await waitFor(() => {
      expect(screen.queryByText("Loading...")).not.toBeInTheDocument();
    });

    screen.debug();

    // expect(screen.getByText("선수목록데스네")).toBeInTheDocument();
  });

  it("선수데이터 렌더링 테스트", async () => {
    renderWithQueryClient(<PlayerDb />);
    // 로딩상태
    screen.debug();
    expect(screen.getByText("Loading...")).toBeInTheDocument();
    // 로딩상태 종료
    await waitFor(() => {
      expect(screen.queryByText("Loading...")).not.toBeInTheDocument();
    });
    // 선수데이터 렌더링 목데이터 21개 존재

    screen.debug();
  });
});

describe("선수 누적평점 DB 컴포넌트 기능 테스트", () => {
  it("가로스크롤이 되어야함", () => {
    render(<PlayerDb />);
  });

  it("익명로그인유저: 클릭시 이용불가팝업", async () => {
    mockAnonymousUser();
    renderWithQueryClient(<PlayerDb />);
    await waitFor(() => {
      expect(screen.queryByText("Loading...")).not.toBeInTheDocument();
    });

    screen.debug();
  });

  it("카카오 로그인유저: 클릭시 선수 상세 페이지이동", async () => {
    mockKakaoUser();
    renderWithQueryClient(<PlayerDb />);
    await waitFor(() => {
      expect(screen.queryByText("Loading...")).not.toBeInTheDocument();
    });

    screen.debug();
  });
});
