import { type ReactNode } from "react";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react";
import { type Mock, beforeEach, describe, expect, it, vi } from "vitest";

import { saveMatchOnPitchPositions } from "@admin/admin-match/admin-match-lineup/api/admin-match-lineup-api";
import { ADMIN_MATCH_LINEUP_QUERY_KEYS } from "@admin/admin-match/admin-match-lineup/api/react-query-api/admin-match-lineup-query-key";
import { useSaveMatchOnPitchPositions } from "@admin/admin-match/admin-match-lineup/api/react-query-api/use-save-match-on-pitch-positions";
import { ADMIN_MATCH_QUERY_KEYS } from "@admin/admin-match/api/react-query-api/admin-match-query-key";

import { type PostgrestError } from "@shared/api/types/api-types";

const toastMock = vi.fn();

vi.mock("@youngduck/yd-ui/Overlays", () => ({
  useOverlay: () => ({ toast: toastMock }),
}));
vi.mock("@sentry/react", () => ({ captureException: vi.fn() }));
vi.mock("@admin/admin-match/admin-match-lineup/api/admin-match-lineup-api", () => ({
  saveMatchOnPitchPositions: vi.fn(),
}));

const saveMatchOnPitchPositionsMock = saveMatchOnPitchPositions as Mock;

const createWrapper = (client: QueryClient) =>
  function Wrapper({ children }: { children: ReactNode }) {
    return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
  };

const MATCH_ID = "m1";
const request = {
  match_id: MATCH_ID,
  formation: "3-4-1-2",
  positions: [{ player_id: "p1", position_id: "pos-CAM" }],
};

describe("useSaveMatchOnPitchPositions", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("성공 시 라인업 리스트와 경기 목록(포메이션)을 무효화하고 성공 토스트를 띄운다", async () => {
    saveMatchOnPitchPositionsMock.mockResolvedValue({ data: true, error: null });
    const client = new QueryClient({ defaultOptions: { mutations: { retry: false } } });
    const invalidateSpy = vi.spyOn(client, "invalidateQueries");

    const { result } = renderHook(() => useSaveMatchOnPitchPositions(MATCH_ID), {
      wrapper: createWrapper(client),
    });
    result.current.mutate(request);

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(saveMatchOnPitchPositionsMock).toHaveBeenCalledWith(request);
    expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ADMIN_MATCH_LINEUP_QUERY_KEYS.list(MATCH_ID) });
    expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ADMIN_MATCH_QUERY_KEYS.lists() });
    expect(toastMock).toHaveBeenCalledWith({ content: "자리를 반영했어요" });
  });

  // 선수 액션 모달은 자리 변경 뒤 기록 저장을 이어서 하므로 성공 토스트를 한 번만 띄운다
  it("silent 면 성공 토스트는 띄우지 않고 무효화만 한다", async () => {
    saveMatchOnPitchPositionsMock.mockResolvedValue({ data: true, error: null });
    const client = new QueryClient({ defaultOptions: { mutations: { retry: false } } });
    const invalidateSpy = vi.spyOn(client, "invalidateQueries");

    const { result } = renderHook(() => useSaveMatchOnPitchPositions(MATCH_ID, { silent: true }), {
      wrapper: createWrapper(client),
    });
    result.current.mutate(request);

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ADMIN_MATCH_LINEUP_QUERY_KEYS.list(MATCH_ID) });
    expect(toastMock).not.toHaveBeenCalled();
  });

  it("실패 시 무효화하지 않고 RPC 코드에 맞는 문구를 띄운다 (silent 여도 실패는 알린다)", async () => {
    const error = {
      name: "PostgrestError",
      message: "PLAYER_NOT_ON_PITCH",
      details: "",
      hint: "",
      code: "PT400",
    } as PostgrestError;
    saveMatchOnPitchPositionsMock.mockResolvedValue({ data: null, error });
    const client = new QueryClient({ defaultOptions: { mutations: { retry: false } } });
    const invalidateSpy = vi.spyOn(client, "invalidateQueries");

    const { result } = renderHook(() => useSaveMatchOnPitchPositions(MATCH_ID, { silent: true }), {
      wrapper: createWrapper(client),
    });
    result.current.mutate(request);

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(invalidateSpy).not.toHaveBeenCalled();
    expect(toastMock).toHaveBeenCalledWith({ content: "그라운드에 있는 선수만 자리를 옮길 수 있어요" });
  });
});
