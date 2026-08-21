import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react";
import { type ReactNode } from "react";
import { type Mock, beforeEach, describe, expect, it, vi } from "vitest";

import { deleteUserByAdmin } from "@admin/admin-user/api/admin-user-api";
import { adminUserQueryKeys } from "@admin/admin-user/api/react-query-api/admin-user-query-keys";
import { useDeleteUser } from "@admin/admin-user/api/react-query-api/use-delete-user";

import { type PostgrestError } from "@shared/api/types/api-types";

const toastMock = vi.fn();

vi.mock("@youngduck/yd-ui/Overlays", () => ({
  useOverlay: () => ({ toast: toastMock }),
}));
vi.mock("@sentry/react", () => ({ captureException: vi.fn() }));
vi.mock("@admin/admin-user/api/admin-user-api", () => ({
  deleteUserByAdmin: vi.fn(),
}));

const deleteUserByAdminMock = deleteUserByAdmin as Mock;

const createWrapper = (client: QueryClient) =>
  function Wrapper({ children }: { children: ReactNode }) {
    return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
  };

const userId = "u1";

describe("useDeleteUser", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("성공 시 사용자 목록 쿼리를 무효화하고 성공 토스트를 띄운다", async () => {
    deleteUserByAdminMock.mockResolvedValue({ data: { success: true }, error: null });
    const client = new QueryClient({ defaultOptions: { mutations: { retry: false } } });
    const invalidateSpy = vi.spyOn(client, "invalidateQueries");

    const { result } = renderHook(() => useDeleteUser(), { wrapper: createWrapper(client) });
    result.current.mutate(userId);

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: adminUserQueryKeys.users() });
    expect(toastMock).toHaveBeenCalledWith({ content: "사용자 탈퇴를 성공했어요" });
  });

  it("실패 시 무효화하지 않고 실패 토스트를 띄운다", async () => {
    const error = { name: "PostgrestError", message: "실패", details: "", hint: "", code: "500" } as PostgrestError;
    deleteUserByAdminMock.mockResolvedValue({ data: null, error });
    const client = new QueryClient({ defaultOptions: { mutations: { retry: false } } });
    const invalidateSpy = vi.spyOn(client, "invalidateQueries");

    const { result } = renderHook(() => useDeleteUser(), { wrapper: createWrapper(client) });
    result.current.mutate(userId);

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(invalidateSpy).not.toHaveBeenCalled();
    expect(toastMock).toHaveBeenCalledWith({ content: "사용자 탈퇴에 실패했어요" });
  });
});
