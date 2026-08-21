import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react";
import { type ReactNode } from "react";
import { type Mock, beforeEach, describe, expect, it, vi } from "vitest";

import { createCountry } from "@admin/admin-country/api/admin-country-api";
import { ADMIN_COUNTRY_QUERY_KEYS } from "@admin/admin-country/api/react-query-api/admin-country-query-keys";
import { useCreateCountry } from "@admin/admin-country/api/react-query-api/use-create-country";

import { type PostgrestError } from "@shared/api/types/api-types";

const toastMock = vi.fn();

vi.mock("@youngduck/yd-ui/Overlays", () => ({
  useOverlay: () => ({ toast: toastMock }),
}));
vi.mock("@sentry/react", () => ({ captureException: vi.fn() }));
vi.mock("@admin/admin-country/api/admin-country-api", () => ({
  createCountry: vi.fn(),
}));

const createCountryMock = createCountry as Mock;

const createWrapper = (client: QueryClient) =>
  function Wrapper({ children }: { children: ReactNode }) {
    return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
  };

const request = {
  name: "독일",
} as const;

describe("useCreateCountry", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("성공 시 국가 쿼리를 무효화하고 성공 토스트를 띄운다", async () => {
    createCountryMock.mockResolvedValue({ data: { id: "co1" }, error: null });
    const client = new QueryClient({ defaultOptions: { mutations: { retry: false } } });
    const invalidateSpy = vi.spyOn(client, "invalidateQueries");

    const { result } = renderHook(() => useCreateCountry(), { wrapper: createWrapper(client) });
    result.current.mutate(request);

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(invalidateSpy).toHaveBeenCalledWith({
      queryKey: [ADMIN_COUNTRY_QUERY_KEYS.ALL_COUNTRIES],
    });
    expect(toastMock).toHaveBeenCalledWith({ content: "국가 추가를 성공했어요" });
  });

  it("실패 시 무효화하지 않고 실패 토스트를 띄운다", async () => {
    const error = { name: "PostgrestError", message: "실패", details: "", hint: "", code: "500" } as PostgrestError;
    createCountryMock.mockResolvedValue({ data: null, error });
    const client = new QueryClient({ defaultOptions: { mutations: { retry: false } } });
    const invalidateSpy = vi.spyOn(client, "invalidateQueries");

    const { result } = renderHook(() => useCreateCountry(), { wrapper: createWrapper(client) });
    result.current.mutate(request);

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(invalidateSpy).not.toHaveBeenCalled();
    expect(toastMock).toHaveBeenCalledWith({
      content: "국가 추가에 실패했어요 (이미 존재하는 국가일 수 있어요)",
    });
  });
});
