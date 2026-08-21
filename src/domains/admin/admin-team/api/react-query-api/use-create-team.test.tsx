import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react";
import { type ReactNode } from "react";
import { type Mock, beforeEach, describe, expect, it, vi } from "vitest";

import { type ICreateTeamRequest, createTeam } from "@admin/admin-team/api/admin-team-api";
import { ADMIN_TEAM_QUERY_KEYS } from "@admin/admin-team/api/react-query-api/admin-team-query-keys";
import { useCreateTeam } from "@admin/admin-team/api/react-query-api/use-create-team";

import { type PostgrestError } from "@shared/api/types/api-types";

const toastMock = vi.fn();

vi.mock("@youngduck/yd-ui/Overlays", () => ({
  useOverlay: () => ({ toast: toastMock }),
}));
vi.mock("@sentry/react", () => ({ captureException: vi.fn() }));
vi.mock("@admin/admin-team/api/admin-team-api", () => ({
  createTeam: vi.fn(),
}));

const createTeamMock = createTeam as Mock;

const createWrapper = (client: QueryClient) =>
  function Wrapper({ children }: { children: ReactNode }) {
    return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
  };

const request = { name: "도르트문트" } as unknown as ICreateTeamRequest;

describe("useCreateTeam", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("성공 시 팀 목록 쿼리를 무효화하고 성공 토스트를 띄운다", async () => {
    createTeamMock.mockResolvedValue({ data: { id: "t1" }, error: null });
    const client = new QueryClient({ defaultOptions: { mutations: { retry: false } } });
    const invalidateSpy = vi.spyOn(client, "invalidateQueries");

    const { result } = renderHook(() => useCreateTeam(), { wrapper: createWrapper(client) });
    result.current.mutate(request);

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: [ADMIN_TEAM_QUERY_KEYS.ALL_TEAMS] });
    expect(toastMock).toHaveBeenCalledWith({ content: "팀 생성을 성공했어요" });
  });

  it("실패 시 무효화하지 않고 실패 토스트를 띄운다", async () => {
    const error = { name: "PostgrestError", message: "실패", details: "", hint: "", code: "500" } as PostgrestError;
    createTeamMock.mockResolvedValue({ data: null, error });
    const client = new QueryClient({ defaultOptions: { mutations: { retry: false } } });
    const invalidateSpy = vi.spyOn(client, "invalidateQueries");

    const { result } = renderHook(() => useCreateTeam(), { wrapper: createWrapper(client) });
    result.current.mutate(request);

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(invalidateSpy).not.toHaveBeenCalled();
    expect(toastMock).toHaveBeenCalledWith({ content: "팀 생성에 실패했어요" });
  });
});
