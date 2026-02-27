import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen, waitFor } from "@testing-library/react";
import { HttpResponse, http } from "msw";

import AttendanceCheck from "@auth/auth-info/auth-info-quick-links/attendance-check/components/attendance-check";
import AttendanceCheckErrorFallback from "@auth/auth-info/auth-info-quick-links/attendance-check/components/error/attendance-check-error-fallback";
import AttendanceCheckSkeleton from "@auth/auth-info/auth-info-quick-links/attendance-check/components/skeleton/attendance-check-skeleton";
import { server } from "@shared/mocks/server";
import ReactQueryBoundary from "@shared/provider/react-query-boundary";

const renderWithQueryClient = () => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });

  return render(
    <QueryClientProvider client={queryClient}>
      <ReactQueryBoundary skeleton={<AttendanceCheckSkeleton />} errorFallback={AttendanceCheckErrorFallback}>
        <AttendanceCheck />
      </ReactQueryBoundary>
    </QueryClientProvider>,
  );
};

const waitForLoadingComplete = async () => {
  await waitFor(() => {
    expect(screen.queryByTestId("attendance-check-skeleton")).not.toBeInTheDocument();
  });
};

describe("AttendanceCheck", () => {
  it("RPC get_attendance_matches 결과를 화면에 렌더링한다", async () => {
    renderWithQueryClient();
    await waitForLoadingComplete();

    // 더미 데이터 기준으로 상대 팀 이름이 노출되는지 확인
    expect(await screen.findByText(/바이에른 뮌헨/)).toBeInTheDocument();
    expect(await screen.findByText(/RB 라이프치히/)).toBeInTheDocument();
  });

  it("RPC 에러가 발생하면 에러 폴백을 렌더링한다", async () => {
    server.use(
      http.post("*/rest/v1/rpc/get_attendance_matches", () => {
        return HttpResponse.json({ message: "error" }, { status: 500 });
      }),
    );

    renderWithQueryClient();

    expect(await screen.findByTestId("attendance-check-error")).toBeInTheDocument();
  });
});
