import { MemoryRouter } from "react-router-dom";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen, waitFor } from "@testing-library/react";
import { HttpResponse, http } from "msw";
import { vi } from "vitest";

import { getAnonymousUserAuthMock } from "@shared/mocks/constants/user-mock-data";
import { server } from "@shared/mocks/server";
import ReactQueryBoundary from "@shared/provider/react-query-boundary";

import MatchesLastestPlayerRating from "@matches/matches-lastest/matches-lastest-player-rating/components/matches-lastest-player-rating";
import MatchesLastestPlayerRatingErrorFallback from "@matches/matches-lastest/matches-lastest-player-rating/components/error/matches-lastest-player-rating-error-fallback";
import MatchesLastestPlayerRatingSkeleton from "@matches/matches-lastest/matches-lastest-player-rating/components/skeleton/matches-lastest-player-rating-skeleton";

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return { ...actual, useParams: () => ({ matchId: "match-456", playerId: "player-123" }) };
});

const mockUseAuth = vi.fn();
vi.mock("@auth/contexts/AuthContext", () => ({
  useAuth: () => mockUseAuth(),
}));

vi.mock("@shared/api/config/supabaseClient", () => ({
  supabase: {
    rpc: vi.fn().mockImplementation((functionName: string) => {
      return fetch(`https://dummy.supabase.co/rest/v1/rpc/${functionName}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      })
        .then((response) => {
          if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
          return response.json();
        })
        .then((data) => ({ data, error: null }));
    }),
    channel: () => ({
      on: () => ({
        subscribe: () => ({}),
      }),
      subscribe: () => ({}),
    }),
    removeChannel: () => {},
  },
}));

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
        <ReactQueryBoundary
          skeleton={<MatchesLastestPlayerRatingSkeleton />}
          errorFallback={MatchesLastestPlayerRatingErrorFallback}
        >
          {component}
        </ReactQueryBoundary>
      </QueryClientProvider>
    </MemoryRouter>,
  );
};

describe("실시간 평점 입력 컴포넌트 렌더링 테스트", () => {
  beforeEach(() => {
    mockUseAuth.mockReturnValue(getAnonymousUserAuthMock());
  });

  it("API호출 전에는 로딩컴포넌트가 나와야한다. 호출 성공시 선수데이터가 렌더링되어야한다", async () => {
    renderWithQueryClient(<MatchesLastestPlayerRating />);

    await waitFor(() => {
      expect(screen.getByText("김영덕")).toBeInTheDocument();
    });
  });

  it("API호출 실패시 에러컴포넌트가 나와야한다", async () => {
    server.use(
      http.post("*/rest/v1/rpc/get_match_single_player_rating", () => {
        return HttpResponse.error();
      }),
    );

    renderWithQueryClient(<MatchesLastestPlayerRating />);
    await waitFor(() => {
      expect(screen.getByText("평점 정보를 불러오지 못했습니다.")).toBeInTheDocument();
    });
  });
});
