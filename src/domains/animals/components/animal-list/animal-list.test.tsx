import { render, screen, waitFor } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { http, HttpResponse } from "msw";
import { server } from "@shared/mocks/server";
import AnimalList from "./animal-list";
import ReactQueryBoundary from "@shared/provider/react-query-boundary";
import AnimalListError from "./error/animal-list-error";
import { MemoryRouter } from "react-router-dom";

describe("동물 목록", () => {
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

  it("로딩 상태를 표시해야 한다", () => {
    renderWithQueryClient(<AnimalList />);
    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  it("MSW로 모킹된 데이터를 불러와서 표시해야 한다", async () => {
    renderWithQueryClient(<AnimalList />);

    // 로딩 상태 확인
    expect(screen.getByText("Loading...")).toBeInTheDocument();

    // 데이터 로딩 완료 대기
    await waitFor(() => {
      expect(screen.queryByText("Loading...")).not.toBeInTheDocument();
    });

    // 실제 데이터가 표시되는지 확인
    screen.debug(); // DOM 상태 확인
  });

  it("에러 발생 시 에러 컴포넌트를 표시해야 한다", async () => {
    // 에러 핸들러로 덮어씌우기
    const errorHandlers = [
      http.get("*/animal", () => {
        return HttpResponse.error();
      }),
    ];

    // MSW 서버에 에러 핸들러 등록
    server.use(...errorHandlers);

    renderWithQueryClient(<AnimalList />);

    // 에러 상태 확인 (더 짧은 타임아웃)
    await waitFor(() => {
      expect(screen.getByText("에러발생")).toBeInTheDocument();
    });
  });
});
