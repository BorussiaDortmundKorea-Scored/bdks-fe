import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { AdminCountryEditModal } from "@admin/admin-country/components/modal/admin-country-edit-modal";

const mutateAsyncMock = vi.fn();

vi.mock("@admin/admin-country/api/react-query-api/use-update-country", () => ({
  useUpdateCountry: () => ({ mutateAsync: mutateAsyncMock, isPending: false }),
}));

const country = { id: 1, name: "독일" } as never;

describe("AdminCountryEditModal", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mutateAsyncMock.mockResolvedValue(undefined);
  });

  it("제목·기존값이 채워진 입력·버튼을 렌더링한다", () => {
    render(<AdminCountryEditModal country={country} onClose={vi.fn()} />);

    expect(screen.getByText("국가 수정")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("예: 독일")).toHaveValue("독일");
    expect(screen.getByRole("button", { name: "수정" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "취소" })).toBeInTheDocument();
  });

  it("국가명을 비우면 수정 버튼이 비활성화된다", () => {
    render(<AdminCountryEditModal country={country} onClose={vi.fn()} />);

    expect(screen.getByRole("button", { name: "수정" })).toBeEnabled();

    fireEvent.change(screen.getByPlaceholderText("예: 독일"), { target: { value: "   " } });

    expect(screen.getByRole("button", { name: "수정" })).toBeDisabled();
  });

  it("수정 클릭 시 트림된 국가명으로 갱신하고 모달을 닫는다", async () => {
    const onClose = vi.fn();
    render(<AdminCountryEditModal country={country} onClose={onClose} />);

    fireEvent.change(screen.getByPlaceholderText("예: 독일"), { target: { value: "  프랑스  " } });
    fireEvent.click(screen.getByRole("button", { name: "수정" }));

    await waitFor(() => expect(mutateAsyncMock).toHaveBeenCalledWith({ id: 1, name: "프랑스" }));
    await waitFor(() => expect(onClose).toHaveBeenCalledTimes(1));
  });

  it("취소 클릭 시 갱신 없이 모달을 닫는다", () => {
    const onClose = vi.fn();
    render(<AdminCountryEditModal country={country} onClose={onClose} />);

    fireEvent.click(screen.getByRole("button", { name: "취소" }));

    expect(mutateAsyncMock).not.toHaveBeenCalled();
    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
