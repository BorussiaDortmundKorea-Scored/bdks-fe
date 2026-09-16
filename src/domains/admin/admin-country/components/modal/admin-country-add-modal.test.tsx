import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { AdminCountryAddModal } from "@admin/admin-country/components/modal/admin-country-add-modal";

const mutateAsyncMock = vi.fn();

vi.mock("@admin/admin-country/api/react-query-api/use-create-country", () => ({
  useCreateCountry: () => ({ mutateAsync: mutateAsyncMock, isPending: false }),
}));

describe("AdminCountryAddModal", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mutateAsyncMock.mockResolvedValue(undefined);
  });

  it("제목·입력·버튼을 렌더링한다", () => {
    render(<AdminCountryAddModal onClose={vi.fn()} />);

    expect(screen.getByText("새 국가 추가")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("예: 독일")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "추가" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "취소" })).toBeInTheDocument();
  });

  // 버튼을 잠가두면 왜 못 누르는지 알 수 없어, 눌러보면 사유를 알려주는 쪽으로 바꿨다
  it("국가명이 비어 있으면 등록하지 않고 입력 밑에 사유를 보여준다", async () => {
    const onClose = vi.fn();
    render(<AdminCountryAddModal onClose={onClose} />);

    fireEvent.click(screen.getByRole("button", { name: "추가" }));

    expect(await screen.findByText("국가명을 입력해주세요")).toBeInTheDocument();
    expect(onClose).not.toHaveBeenCalled();
  });

  it("추가 클릭 시 트림된 국가명으로 등록하고 모달을 닫는다", async () => {
    const onClose = vi.fn();
    render(<AdminCountryAddModal onClose={onClose} />);

    fireEvent.change(screen.getByPlaceholderText("예: 독일"), { target: { value: "  독일  " } });
    fireEvent.click(screen.getByRole("button", { name: "추가" }));

    await waitFor(() => expect(mutateAsyncMock).toHaveBeenCalledWith({ name: "독일" }));
    await waitFor(() => expect(onClose).toHaveBeenCalledTimes(1));
  });

  it("취소 클릭 시 등록 없이 모달을 닫는다", () => {
    const onClose = vi.fn();
    render(<AdminCountryAddModal onClose={onClose} />);

    fireEvent.click(screen.getByRole("button", { name: "취소" }));

    expect(mutateAsyncMock).not.toHaveBeenCalled();
    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
