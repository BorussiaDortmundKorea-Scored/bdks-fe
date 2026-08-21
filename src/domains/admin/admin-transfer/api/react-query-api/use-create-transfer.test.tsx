import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react";
import { type ReactNode } from "react";
import { type Mock, beforeEach, describe, expect, it, vi } from "vitest";

import { createTransfer } from "@admin/admin-transfer/api/admin-transfer-api";
import { useCreateTransfer } from "@admin/admin-transfer/api/react-query-api/use-create-transfer";

import { type PostgrestError } from "@shared/api/types/api-types";

const toastMock = vi.fn();

vi.mock("@youngduck/yd-ui/Overlays", () => ({
  useOverlay: () => ({ toast: toastMock }),
}));
vi.mock("@sentry/react", () => ({ captureException: vi.fn() }));
vi.mock("@admin/admin-transfer/api/admin-transfer-api", () => ({
  createTransfer: vi.fn(),
}));

const createTransferMock = createTransfer as Mock;

const createWrapper = (client: QueryClient) =>
  function Wrapper({ children }: { children: ReactNode }) {
    return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
  };

const request = {
  player_id: "p1",
  direction: "IN",
  transfer_type: "PERMANENT",
} as const;

describe("useCreateTransfer", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("성공 시 transfers 쿼리를 무효화하고 성공 토스트를 띄운다", async () => {
    createTransferMock.mockResolvedValue({ data: { id: "t1" }, error: null });
    const client = new QueryClient({ defaultOptions: { mutations: { retry: false } } });
    const invalidateSpy = vi.spyOn(client, "invalidateQueries");

    const { result } = renderHook(() => useCreateTransfer(), { wrapper: createWrapper(client) });
    result.current.mutate(request);

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ["admin-transfers"] });
    expect(toastMock).toHaveBeenCalledWith({ content: "이적 등록을 성공했어요" });
  });

  it("실패 시 무효화하지 않고 실패 토스트를 띄운다", async () => {
    const error = { name: "PostgrestError", message: "실패", details: "", hint: "", code: "500" } as PostgrestError;
    createTransferMock.mockResolvedValue({ data: null, error });
    const client = new QueryClient({ defaultOptions: { mutations: { retry: false } } });
    const invalidateSpy = vi.spyOn(client, "invalidateQueries");

    const { result } = renderHook(() => useCreateTransfer(), { wrapper: createWrapper(client) });
    result.current.mutate(request);

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(invalidateSpy).not.toHaveBeenCalled();
    expect(toastMock).toHaveBeenCalledWith({ content: "이적 등록에 실패했어요" });
  });
});
