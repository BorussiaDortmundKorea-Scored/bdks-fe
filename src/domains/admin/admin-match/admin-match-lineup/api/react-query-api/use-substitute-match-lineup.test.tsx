import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react";
import { type ReactNode } from "react";
import { type Mock, beforeEach, describe, expect, it, vi } from "vitest";

import { substituteMatchLineup } from "@admin/admin-match/admin-match-lineup/api/admin-match-lineup-api";
import { ADMIN_MATCH_LINEUP_QUERY_KEYS } from "@admin/admin-match/admin-match-lineup/api/react-query-api/admin-match-lineup-query-key";
import { useSubstituteMatchLineup } from "@admin/admin-match/admin-match-lineup/api/react-query-api/use-substitute-match-lineup";

import { type PostgrestError } from "@shared/api/types/api-types";

const toastMock = vi.fn();

const { sendMock, removeChannelMock, subscribeMock } = vi.hoisted(() => {
  const send = vi.fn().mockResolvedValue(undefined);
  return {
    sendMock: send,
    removeChannelMock: vi.fn(),
    subscribeMock: vi.fn((cb: (status: string) => void) => {
      cb("SUBSCRIBED");
      return { send };
    }),
  };
});

vi.mock("@youngduck/yd-ui/Overlays", () => ({
  useOverlay: () => ({ toast: toastMock }),
}));
vi.mock("@sentry/react", () => ({ captureException: vi.fn() }));
vi.mock("@admin/admin-match/admin-match-lineup/api/admin-match-lineup-api", () => ({
  substituteMatchLineup: vi.fn(),
}));
vi.mock("@shared/api/config/supabaseClient", () => ({
  supabase: {
    channel: () => ({ subscribe: subscribeMock, send: sendMock }),
    removeChannel: removeChannelMock,
  },
}));

const substituteMatchLineupMock = substituteMatchLineup as Mock;

const createWrapper = (client: QueryClient) =>
  function Wrapper({ children }: { children: ReactNode }) {
    return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
  };

const MATCH_ID = "m1";
const request = {
  lineup_id: 1,
  substitution_minute: 60,
  partner_player_id: "p2",
} as const;

describe("useSubstituteMatchLineup", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("성공 시 라인업 리스트 쿼리를 무효화하고 성공 토스트를 띄운다", async () => {
    substituteMatchLineupMock.mockResolvedValue({ data: true, error: null });
    const client = new QueryClient({ defaultOptions: { mutations: { retry: false } } });
    const invalidateSpy = vi.spyOn(client, "invalidateQueries");

    const { result } = renderHook(() => useSubstituteMatchLineup(MATCH_ID), {
      wrapper: createWrapper(client),
    });
    result.current.mutate(request);

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(invalidateSpy).toHaveBeenCalledWith({
      queryKey: ADMIN_MATCH_LINEUP_QUERY_KEYS.list(MATCH_ID),
    });
    expect(toastMock).toHaveBeenCalledWith({ content: "선수 교체를 성공했어요" });
  });

  it("실패 시 무효화하지 않고 실패 토스트를 띄운다", async () => {
    const error = { name: "PostgrestError", message: "실패", details: "", hint: "", code: "500" } as PostgrestError;
    substituteMatchLineupMock.mockResolvedValue({ data: null, error });
    const client = new QueryClient({ defaultOptions: { mutations: { retry: false } } });
    const invalidateSpy = vi.spyOn(client, "invalidateQueries");

    const { result } = renderHook(() => useSubstituteMatchLineup(MATCH_ID), {
      wrapper: createWrapper(client),
    });
    result.current.mutate(request);

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(invalidateSpy).not.toHaveBeenCalled();
    expect(toastMock).toHaveBeenCalledWith({ content: "선수 교체에 실패했어요" });
  });
});
