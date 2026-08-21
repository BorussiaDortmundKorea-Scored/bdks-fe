import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react";
import { type ReactNode } from "react";
import { type Mock, beforeEach, describe, expect, it, vi } from "vitest";

import { updateMatch } from "@admin/admin-match/api/admin-match-api";
import { ADMIN_MATCH_QUERY_KEYS } from "@admin/admin-match/api/react-query-api/admin-match-query-key";
import { useUpdateMatch } from "@admin/admin-match/api/react-query-api/use-update-match";

import { type PostgrestError } from "@shared/api/types/api-types";

const toastMock = vi.fn();

vi.mock("@youngduck/yd-ui/Overlays", () => ({
  useOverlay: () => ({ toast: toastMock }),
}));
vi.mock("@sentry/react", () => ({ captureException: vi.fn() }));
vi.mock("@admin/admin-match/api/admin-match-api", () => ({
  updateMatch: vi.fn(),
}));

const updateMatchMock = updateMatch as Mock;

const createWrapper = (client: QueryClient) =>
  function Wrapper({ children }: { children: ReactNode }) {
    return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
  };

const request = {
  id: "m1",
  match_start_time: "20:00",
  second_half_start_time: "20:45",
  first_half_end_time: "20:45",
  second_half_end_time: "21:30",
};

describe("useUpdateMatch", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("성공 시 경기 목록 쿼리를 무효화하고 성공 토스트를 띄운다", async () => {
    updateMatchMock.mockResolvedValue({ data: { id: "m1" }, error: null });
    const client = new QueryClient({ defaultOptions: { mutations: { retry: false } } });
    const invalidateSpy = vi.spyOn(client, "invalidateQueries");

    const { result } = renderHook(() => useUpdateMatch(), { wrapper: createWrapper(client) });
    result.current.mutate(request);

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ADMIN_MATCH_QUERY_KEYS.lists() });
    expect(toastMock).toHaveBeenCalledWith({ content: "경기 수정을 성공했어요" });
  });

  it("실패 시 무효화하지 않고 실패 토스트를 띄운다", async () => {
    const error = { name: "PostgrestError", message: "실패", details: "", hint: "", code: "500" } as PostgrestError;
    updateMatchMock.mockResolvedValue({ data: null, error });
    const client = new QueryClient({ defaultOptions: { mutations: { retry: false } } });
    const invalidateSpy = vi.spyOn(client, "invalidateQueries");

    const { result } = renderHook(() => useUpdateMatch(), { wrapper: createWrapper(client) });
    result.current.mutate(request);

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(invalidateSpy).not.toHaveBeenCalled();
    expect(toastMock).toHaveBeenCalledWith({ content: "경기 수정에 실패했어요" });
  });
});
