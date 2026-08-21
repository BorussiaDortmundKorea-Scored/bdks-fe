import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { AdminPlayerAddModal } from "@admin/admin-player/components/modal/admin-player-add-modal";

const mutateAsyncMock = vi.fn();

vi.mock("@admin/admin-player/api/react-query-api/use-create-player", () => ({
  useCreatePlayer: () => ({ mutateAsync: mutateAsyncMock, isPending: false }),
}));

describe("AdminPlayerAddModal", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mutateAsyncMock.mockResolvedValue(undefined);
  });

  it("제목·입력·버튼을 렌더링한다", () => {
    render(<AdminPlayerAddModal onClose={vi.fn()} />);

    expect(screen.getByText("새 선수 추가")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("선수 이름을 입력하세요")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("국적을 입력하세요")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "추가" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "취소" })).toBeInTheDocument();
  });

  it("이름이 비어 있으면 추가 버튼이 비활성화된다", () => {
    render(<AdminPlayerAddModal onClose={vi.fn()} />);

    expect(screen.getByRole("button", { name: "추가" })).toBeDisabled();

    fireEvent.change(screen.getByPlaceholderText("선수 이름을 입력하세요"), {
      target: { value: "Meyer" },
    });

    expect(screen.getByRole("button", { name: "추가" })).toBeEnabled();
  });

  it("추가 클릭 시 입력값으로 등록하고 모달을 닫는다", async () => {
    const onClose = vi.fn();
    render(<AdminPlayerAddModal onClose={onClose} />);

    fireEvent.change(screen.getByPlaceholderText("선수 이름을 입력하세요"), {
      target: { value: "Meyer" },
    });
    fireEvent.change(screen.getByPlaceholderText("국적을 입력하세요"), {
      target: { value: "독일" },
    });
    fireEvent.click(screen.getByRole("button", { name: "추가" }));

    await waitFor(() =>
      expect(mutateAsyncMock).toHaveBeenCalledWith({
        name: "Meyer",
        korean_name: undefined,
        jersey_number: undefined,
        nationality: "독일",
        full_profile_image_url: undefined,
        head_profile_image_url: undefined,
      }),
    );
    await waitFor(() => expect(onClose).toHaveBeenCalledTimes(1));
  });

  it("취소 클릭 시 등록 없이 모달을 닫는다", () => {
    const onClose = vi.fn();
    render(<AdminPlayerAddModal onClose={onClose} />);

    fireEvent.click(screen.getByRole("button", { name: "취소" }));

    expect(mutateAsyncMock).not.toHaveBeenCalled();
    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
