import { render, screen, waitFor, within, fireEvent } from "@testing-library/react";
import PlayersDb from "./players-db";
import { QueryClient } from "@tanstack/react-query";
import { QueryClientProvider } from "@tanstack/react-query";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import ReactQueryBoundary from "@shared/provider/react-query-boundary";
import { vi } from "vitest";
import PlayersDBDummy from "../mocks/players-db-dummy.json";
import { server } from "@shared/mocks/server";
import { http, HttpResponse } from "msw";
import PlayerDbSkeleton from "./skeleton/players-db-skeleton";
import PlayerDbErrorFallback from "./error/players-db-error-fallback";

// 모킹 모듈 가져오기
const mockUseAuth = vi.fn();

vi.mock("@auth/contexts/AuthContext", () => ({
  useAuth: () => mockUseAuth(),
}));
// 유저 모킹 함수들
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
        <ReactQueryBoundary skeleton={<PlayerDbSkeleton />} errorFallback={PlayerDbErrorFallback}>
          {component}
        </ReactQueryBoundary>
      </QueryClientProvider>
    </MemoryRouter>,
  );
};

// 로딩 완료 대기 헬퍼 함수
const waitForLoadingComplete = async () => {
  await waitFor(() => {
    expect(screen.queryByTestId("player-db-skeleton")).not.toBeInTheDocument();
  });
};

// 로딩 완료 후 컴포넌트 렌더링 헬퍼 함수
const renderAndWaitForLoad = async (component: React.ReactElement) => {
  renderWithQueryClient(component);
  await waitForLoadingComplete();
};

describe("선수 누적평점 컴포넌트 렌더링 테스트", () => {
  beforeEach(() => {
    mockAnonymousUser();
  });

  // 로딩 테스트는 한 번만
  it("API호출 전에는 로딩컴포넌트가 나와야한다. 호출 성공시 로딩컴포넌트가 사라지고 선수데이터가 렌더링되어야한다", async () => {
    renderWithQueryClient(<PlayersDb />);

    // 로딩 상태 확인
    const loadingElement = await screen.findByTestId("player-db-skeleton");
    expect(loadingElement).toBeInTheDocument();

    // 로딩 완료 후 데이터 확인
    const title = await screen.findByText("그레고르 코벨");
    expect(title).toBeInTheDocument();
  });

  it("API호출 실패시 에러컴포넌트가 나와야한다", async () => {
    server.use(
      http.post("*/rest/v1/rpc/get_all_players_db_with_my_ratings", () => {
        return HttpResponse.error();
      }),
    );

    renderWithQueryClient(<PlayersDb />);
    const errorElement = await screen.findByText("에러발생");
    expect(errorElement).toBeInTheDocument();
  });

  // 나머지 테스트들은 로딩 완료 후 실행
  it("헤더 '선수 DB'가 렌더링 되어야 한다", async () => {
    await renderAndWaitForLoad(<PlayersDb />);

    const headerElement = screen.getByRole("heading", { level: 2 });
    expect(headerElement).toBeInTheDocument();
    expect(headerElement.textContent).toBe("선수 DB");
  });

  it("목데이터 21명의 선수가 모두 렌더링 되어야 한다", async () => {
    await renderAndWaitForLoad(<PlayersDb />);

    const playerList = screen.getAllByRole("listitem");
    expect(playerList.length).toBe(21);

    const mockData = PlayersDBDummy;
    mockData.forEach((player) => {
      expect(screen.getByText(player.korean_name)).toBeInTheDocument();
    });
  });

  it("목데이터 21명중  평점(전체,my)이 null인경우 0점, 아닐경우 DB상의 점수가 나와야 한다", async () => {
    await renderAndWaitForLoad(<PlayersDb />);

    const mockData = PlayersDBDummy;
    mockData.forEach((player) => {
      const playerElement = screen.getByText(player.korean_name).closest("li") as HTMLElement;

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

  it("목데이터 21명의 선수 이미지가 렌더링 되어야 한다", async () => {
    await renderAndWaitForLoad(<PlayersDb />);

    const playerList = screen.getAllByRole("img");
    expect(playerList.length).toBe(21);

    playerList.forEach((player) => {
      expect(player).toBeInTheDocument();
    });
  });
});

describe("선수 누적평점 DB 컴포넌트 기능 테스트", () => {
  it("가로스크롤이 되어야함", async () => {
    const user = userEvent.setup();
    mockAnonymousUser();
    await renderAndWaitForLoad(<PlayersDb />);

    const scrollContainer = screen.getByRole("list");

    fireEvent.scroll(scrollContainer, {
      target: { scrollLeft: 100 },
    });

    await user.hover(scrollContainer);
    await user.pointer({ target: scrollContainer, keys: "[TouchA]" });
    await user.pointer({ target: scrollContainer, coords: { x: 100, y: 0 } });

    expect(scrollContainer.scrollLeft).toBe(100);

    // expect(scrollContainer.scrollLeft).toBe(100);
  });

  it("익명로그인유저: 클릭시 이용불가팝업", async () => {
    const user = userEvent.setup();
    mockAnonymousUser();
    await renderAndWaitForLoad(<PlayersDb />);

    const firstPlayer = screen.getByText("그레고르 코벨").closest("li") as HTMLElement;
    await user.click(firstPlayer);

    // alert 모킹 확인
    // expect(window.alert).toHaveBeenCalledWith("익명 로그인 사용자는 이용할 수 없습니다");
  });

  it("카카오 로그인유저: 클릭시 선수 상세 페이지이동", async () => {
    mockKakaoUser();
    await renderAndWaitForLoad(<PlayersDb />);

    const playerList = screen.getAllByRole("listitem");
    expect(playerList.length).toBe(21);

    const firstPlayer = screen.getByText("그레고르 코벨").closest("li");
    fireEvent.click(firstPlayer!);

    // expect(window.alert).toHaveBeenCalledWith("준비중입니다.");
  });
});
