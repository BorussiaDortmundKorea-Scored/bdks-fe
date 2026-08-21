import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react";
import { type ReactNode } from "react";
import { type Mock, beforeEach, describe, expect, it, vi } from "vitest";

import { deleteCompetition } from "@admin/admin-competition/api/admin-competition-api";
import { ADMIN_COMPETITION_QUERY_KEYS } from "@admin/admin-competition/api/react-query-api/admin-competition-query-keys";
import { useDeleteCompetition } from "@admin/admin-competition/api/react-query-api/use-delete-competition";

import { type PostgrestError } from "@shared/api/types/api-types";

const toastMock = vi.fn();

vi.mock("@youngduck/yd-ui/Overlays", () => ({
  useOverlay: () => ({ toast: toastMock }),
}));
vi.mock("@sentry/react", () => ({ captureException: vi.fn() }));
vi.mock("@admin/admin-competition/api/admin-competition-api", () => ({
  deleteCompetition: vi.fn(),
}));

const deleteCompetitionMock = deleteCompetition as Mock;

const createWrapper = (client: QueryClient) =>
  function Wrapper({ children }: { children: ReactNode }) {
    return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
  };

const request = "c1";

describe("useDeleteCompetition", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("성공 시 대회 쿼리를 무효화하고 성공 토스트를 띄운다", async () => {
    deleteCompetitionMock.mockResolvedValue({ data: true, error: null });
    const client = new QueryClient({ defaultOptions: { mutations: { retry: false } } });
    const invalidateSpy = vi.spyOn(client, "invalidateQueries");

    const { result } = renderHook(() => useDeleteCompetition(), { wrapper: createWrapper(client) });
    result.current.mutate(request);

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(invalidateSpy).toHaveBeenCalledWith({
      queryKey: [ADMIN_COMPETITION_QUERY_KEYS.ALL_COMPETITIONS],
    });
    expect(toastMock).toHaveBeenCalledWith({ content: "대회 삭제를 성공했어요" });
  });

  it("실패 시 무효화하지 않고 실패 토스트를 띄운다", async () => {
    const error = { name: "PostgrestError", message: "실패", details: "", hint: "", code: "500" } as PostgrestError;
    deleteCompetitionMock.mockResolvedValue({ data: null, error });
    const client = new QueryClient({ defaultOptions: { mutations: { retry: false } } });
    const invalidateSpy = vi.spyOn(client, "invalidateQueries");

    const { result } = renderHook(() => useDeleteCompetition(), { wrapper: createWrapper(client) });
    result.current.mutate(request);

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(invalidateSpy).not.toHaveBeenCalled();
    expect(toastMock).toHaveBeenCalledWith({ content: "대회 삭제에 실패했어요" });
  });
});
