import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react";
import { type ReactNode } from "react";
import { type Mock, beforeEach, describe, expect, it, vi } from "vitest";

import { deleteCountry } from "@admin/admin-country/api/admin-country-api";
import { ADMIN_COUNTRY_QUERY_KEYS } from "@admin/admin-country/api/react-query-api/admin-country-query-keys";
import { useDeleteCountry } from "@admin/admin-country/api/react-query-api/use-delete-country";

import { type PostgrestError } from "@shared/api/types/api-types";

const toastMock = vi.fn();

vi.mock("@youngduck/yd-ui/Overlays", () => ({
  useOverlay: () => ({ toast: toastMock }),
}));
vi.mock("@sentry/react", () => ({ captureException: vi.fn() }));
vi.mock("@admin/admin-country/api/admin-country-api", () => ({
  deleteCountry: vi.fn(),
}));

const deleteCountryMock = deleteCountry as Mock;

const createWrapper = (client: QueryClient) =>
  function Wrapper({ children }: { children: ReactNode }) {
    return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
  };

const request = "co1";

describe("useDeleteCountry", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("성공 시 국가 쿼리를 무효화하고 성공 토스트를 띄운다", async () => {
    deleteCountryMock.mockResolvedValue({ data: true, error: null });
    const client = new QueryClient({ defaultOptions: { mutations: { retry: false } } });
    const invalidateSpy = vi.spyOn(client, "invalidateQueries");

    const { result } = renderHook(() => useDeleteCountry(), { wrapper: createWrapper(client) });
    result.current.mutate(request);

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(invalidateSpy).toHaveBeenCalledWith({
      queryKey: [ADMIN_COUNTRY_QUERY_KEYS.ALL_COUNTRIES],
    });
    expect(toastMock).toHaveBeenCalledWith({ content: "국가 삭제를 성공했어요" });
  });

  it("실패 시 무효화하지 않고 실패 토스트를 띄운다", async () => {
    const error = { name: "PostgrestError", message: "실패", details: "", hint: "", code: "500" } as PostgrestError;
    deleteCountryMock.mockResolvedValue({ data: null, error });
    const client = new QueryClient({ defaultOptions: { mutations: { retry: false } } });
    const invalidateSpy = vi.spyOn(client, "invalidateQueries");

    const { result } = renderHook(() => useDeleteCountry(), { wrapper: createWrapper(client) });
    result.current.mutate(request);

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(invalidateSpy).not.toHaveBeenCalled();
    expect(toastMock).toHaveBeenCalledWith({
      content: "국가 삭제에 실패했어요 (사용 중인 국가는 삭제할 수 없어요)",
    });
  });
});
