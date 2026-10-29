import { type ReactNode } from "react";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react";
import { type Mock, beforeEach, describe, expect, it, vi } from "vitest";

import { addMatchBenchPlayers } from "@admin/admin-match/admin-match-lineup/api/admin-match-lineup-api";
import { ADMIN_MATCH_LINEUP_QUERY_KEYS } from "@admin/admin-match/admin-match-lineup/api/react-query-api/admin-match-lineup-query-key";
import { useAddMatchBenchPlayers } from "@admin/admin-match/admin-match-lineup/api/react-query-api/use-add-match-bench-players";

import { type PostgrestError } from "@shared/api/types/api-types";

const toastMock = vi.fn();

vi.mock("@youngduck/yd-ui/Overlays", () => ({
  useOverlay: () => ({ toast: toastMock }),
}));
vi.mock("@sentry/react", () => ({ captureException: vi.fn() }));
vi.mock("@admin/admin-match/admin-match-lineup/api/admin-match-lineup-api", () => ({
  addMatchBenchPlayers: vi.fn(),
}));

const addMatchBenchPlayersMock = addMatchBenchPlayers as Mock;

const createWrapper = (client: QueryClient) =>
  function Wrapper({ children }: { children: ReactNode }) {
    return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
  };

const MATCH_ID = "m1";
const request = { match_id: MATCH_ID, player_ids: ["p1", "p2", "p3"] };

describe("useAddMatchBenchPlayers", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // 이미 명단에 있던 선수는 RPC 가 건너뛰므로, 고른 수가 아니라 실제로 들어간 수를 알린다
  it("성공 시 라인업 리스트를 무효화하고 실제로 추가된 인원을 토스트로 알린다", async () => {
    addMatchBenchPlayersMock.mockResolvedValue({ data: 2, error: null });
    const client = new QueryClient({ defaultOptions: { mutations: { retry: false } } });
    const invalidateSpy = vi.spyOn(client, "invalidateQueries");

    const { result } = renderHook(() => useAddMatchBenchPlayers(MATCH_ID), {
      wrapper: createWrapper(client),
    });
    result.current.mutate(request);

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(addMatchBenchPlayersMock).toHaveBeenCalledWith(request);
    expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ADMIN_MATCH_LINEUP_QUERY_KEYS.list(MATCH_ID) });
    expect(toastMock).toHaveBeenCalledWith({ content: "후보 2명을 추가했어요" });
  });

  it("실패 시 무효화하지 않고 RPC 코드에 맞는 문구를 띄운다", async () => {
    const error = {
      name: "PostgrestError",
      message: "PLAYER_NOT_FOUND",
      details: "",
      hint: "",
      code: "PT404",
    } as PostgrestError;
    addMatchBenchPlayersMock.mockResolvedValue({ data: null, error });
    const client = new QueryClient({ defaultOptions: { mutations: { retry: false } } });
    const invalidateSpy = vi.spyOn(client, "invalidateQueries");

    const { result } = renderHook(() => useAddMatchBenchPlayers(MATCH_ID), {
      wrapper: createWrapper(client),
    });
    result.current.mutate(request);

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(invalidateSpy).not.toHaveBeenCalled();
    expect(toastMock).toHaveBeenCalledWith({ content: "없는 선수가 있어요" });
  });
});
