import { type ReactNode } from "react";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react";
import { type Mock, beforeEach, describe, expect, it, vi } from "vitest";

import { saveMatchStartingLineup } from "@admin/admin-match/admin-match-lineup/api/admin-match-lineup-api";
import { ADMIN_MATCH_LINEUP_QUERY_KEYS } from "@admin/admin-match/admin-match-lineup/api/react-query-api/admin-match-lineup-query-key";
import { useSaveMatchStartingLineup } from "@admin/admin-match/admin-match-lineup/api/react-query-api/use-save-match-starting-lineup";
import { ADMIN_MATCH_QUERY_KEYS } from "@admin/admin-match/api/react-query-api/admin-match-query-key";

import { type PostgrestError } from "@shared/api/types/api-types";

const toastMock = vi.fn();

vi.mock("@youngduck/yd-ui/Overlays", () => ({
  useOverlay: () => ({ toast: toastMock }),
}));
vi.mock("@sentry/react", () => ({ captureException: vi.fn() }));
vi.mock("@admin/admin-match/admin-match-lineup/api/admin-match-lineup-api", () => ({
  saveMatchStartingLineup: vi.fn(),
}));

const saveMatchStartingLineupMock = saveMatchStartingLineup as Mock;

const createWrapper = (client: QueryClient) =>
  function Wrapper({ children }: { children: ReactNode }) {
    return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
  };

const MATCH_ID = "m1";
const request = {
  match_id: MATCH_ID,
  formation: "4-2-3-1",
  lineups: [{ player_id: "p1", position_id: "pos-ST", is_captain: true }],
};

describe("useSaveMatchStartingLineup", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("성공 시 라인업 리스트와 경기 목록(포메이션)을 무효화하고 성공 토스트를 띄운다", async () => {
    saveMatchStartingLineupMock.mockResolvedValue({ data: true, error: null });
    const client = new QueryClient({ defaultOptions: { mutations: { retry: false } } });
    const invalidateSpy = vi.spyOn(client, "invalidateQueries");

    const { result } = renderHook(() => useSaveMatchStartingLineup(MATCH_ID), {
      wrapper: createWrapper(client),
    });
    result.current.mutate(request);

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(saveMatchStartingLineupMock).toHaveBeenCalledWith(request);
    expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ADMIN_MATCH_LINEUP_QUERY_KEYS.list(MATCH_ID) });
    expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ADMIN_MATCH_QUERY_KEYS.lists() });
    expect(toastMock).toHaveBeenCalledWith({ content: "라인업에 반영했어요" });
  });

  it("실패 시 무효화하지 않고 RPC 코드에 맞는 문구를 띄운다", async () => {
    const error = {
      name: "PostgrestError",
      message: "STARTER_HAS_RECORDS",
      details: "",
      hint: "",
      code: "PT409",
    } as PostgrestError;
    saveMatchStartingLineupMock.mockResolvedValue({ data: null, error });
    const client = new QueryClient({ defaultOptions: { mutations: { retry: false } } });
    const invalidateSpy = vi.spyOn(client, "invalidateQueries");

    const { result } = renderHook(() => useSaveMatchStartingLineup(MATCH_ID), {
      wrapper: createWrapper(client),
    });
    result.current.mutate(request);

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(invalidateSpy).not.toHaveBeenCalled();
    expect(toastMock).toHaveBeenCalledWith({
      content: "골·카드·교체 기록이 있는 선발은 자리에서 뺄 수 없어요. 기록을 먼저 정리해주세요",
    });
  });
});
