import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react";
import { type ReactNode } from "react";
import { type Mock, beforeEach, describe, expect, it, vi } from "vitest";

import { deletePlayer } from "@admin/admin-player/api/admin-player-api";
import { ADMIN_PLAYER_QUERY_KEYS } from "@admin/admin-player/api/react-query-api/admin-player-query-keys";
import { useDeletePlayer } from "@admin/admin-player/api/react-query-api/use-delete-player";

import { type PostgrestError } from "@shared/api/types/api-types";

const toastMock = vi.fn();

vi.mock("@youngduck/yd-ui/Overlays", () => ({
  useOverlay: () => ({ toast: toastMock }),
}));
vi.mock("@sentry/react", () => ({ captureException: vi.fn() }));
vi.mock("@admin/admin-player/api/admin-player-api", () => ({
  deletePlayer: vi.fn(),
}));

const deletePlayerMock = deletePlayer as Mock;

const createWrapper = (client: QueryClient) =>
  function Wrapper({ children }: { children: ReactNode }) {
    return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
  };

const playerId = "p1";

describe("useDeletePlayer", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("성공 시 선수 목록 쿼리를 무효화하고 성공 토스트를 띄운다", async () => {
    deletePlayerMock.mockResolvedValue({ data: true, error: null });
    const client = new QueryClient({ defaultOptions: { mutations: { retry: false } } });
    const invalidateSpy = vi.spyOn(client, "invalidateQueries");

    const { result } = renderHook(() => useDeletePlayer(), { wrapper: createWrapper(client) });
    await result.current.mutateAsync(playerId);

    await waitFor(() =>
      expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: [ADMIN_PLAYER_QUERY_KEYS.ALL_PLAYERS] }),
    );
    expect(toastMock).toHaveBeenCalledWith({ content: "선수 삭제를 성공했어요" });
  });

  it("실패 시 무효화하지 않고 실패 토스트를 띄운다", async () => {
    const error = { name: "PostgrestError", message: "실패", details: "", hint: "", code: "500" } as PostgrestError;
    deletePlayerMock.mockResolvedValue({ data: null, error });
    const client = new QueryClient({ defaultOptions: { mutations: { retry: false } } });
    const invalidateSpy = vi.spyOn(client, "invalidateQueries");

    const { result } = renderHook(() => useDeletePlayer(), { wrapper: createWrapper(client) });
    await expect(result.current.mutateAsync(playerId)).rejects.toThrow();

    expect(invalidateSpy).not.toHaveBeenCalled();
    expect(toastMock).toHaveBeenCalledWith({ content: "선수 삭제에 실패했어요" });
  });
});
