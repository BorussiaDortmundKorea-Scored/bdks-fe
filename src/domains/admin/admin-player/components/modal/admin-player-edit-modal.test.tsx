import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import type { IPlayer } from "@admin/admin-player/api/admin-player-api";
import { AdminPlayerEditModal } from "@admin/admin-player/components/modal/admin-player-edit-modal";

const mutateAsyncMock = vi.fn();

vi.mock("@admin/admin-player/api/react-query-api/use-update-player", () => ({
  useUpdatePlayer: () => ({ mutateAsync: mutateAsyncMock, isPending: false }),
}));

const basePlayer = {
  id: "player-1",
  name: "Meyer",
  korean_name: "마이어",
  jersey_number: 10,
  nationality: "독일",
  full_profile_image_url: null,
  head_profile_image_url: null,
} as unknown as IPlayer;

describe("AdminPlayerEditModal", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mutateAsyncMock.mockResolvedValue(undefined);
  });

  it("제목·입력·버튼을 렌더링하고 프리필한다", () => {
    render(<AdminPlayerEditModal player={basePlayer} onClose={vi.fn()} />);

    expect(screen.getByText("선수 수정")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Meyer")).toBeInTheDocument();
    expect(screen.getByDisplayValue("마이어")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "수정" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "취소" })).toBeInTheDocument();
  });

  // 버튼을 잠가두면 왜 못 누르는지 알 수 없어, 눌러보면 사유를 알려주는 쪽으로 바꿨다
  it("이름을 비우면 갱신하지 않고 입력 밑에 사유를 보여준다", async () => {
    const onClose = vi.fn();
    render(<AdminPlayerEditModal player={basePlayer} onClose={onClose} />);

    fireEvent.change(screen.getByDisplayValue("Meyer"), { target: { value: "" } });
    fireEvent.click(screen.getByRole("button", { name: "수정" }));

    expect(await screen.findByText("선수 이름을 입력해주세요")).toBeInTheDocument();
    expect(onClose).not.toHaveBeenCalled();
  });

  it("수정 클릭 시 변경된 값으로 수정하고 모달을 닫는다", async () => {
    const onClose = vi.fn();
    render(<AdminPlayerEditModal player={basePlayer} onClose={onClose} />);

    fireEvent.change(screen.getByDisplayValue("Meyer"), { target: { value: "Meyer2" } });
    fireEvent.click(screen.getByRole("button", { name: "수정" }));

    await waitFor(() =>
      expect(mutateAsyncMock).toHaveBeenCalledWith({
        id: "player-1",
        name: "Meyer2",
        korean_name: "마이어",
        jersey_number: 10,
        nationality: "독일",
        full_profile_image_url: undefined,
        head_profile_image_url: undefined,
      }),
    );
    await waitFor(() => expect(onClose).toHaveBeenCalledTimes(1));
  });

  it("취소 클릭 시 수정 없이 모달을 닫는다", () => {
    const onClose = vi.fn();
    render(<AdminPlayerEditModal player={basePlayer} onClose={onClose} />);

    fireEvent.click(screen.getByRole("button", { name: "취소" }));

    expect(mutateAsyncMock).not.toHaveBeenCalled();
    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
