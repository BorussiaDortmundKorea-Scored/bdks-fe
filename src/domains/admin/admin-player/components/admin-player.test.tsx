import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import AdminPlayer from "@admin/admin-player/components/admin-player";

const { modalOpen } = vi.hoisted(() => ({ modalOpen: vi.fn() }));
vi.mock("@youngduck/yd-ui/Overlays", () => ({
  useOverlay: () => ({
    confirmDialog: vi.fn(),
    modalOpen,
  }),
}));

vi.mock("@admin/admin-player/api/react-query-api/use-delete-player", () => ({
  useDeletePlayer: () => ({ mutateAsync: vi.fn() }),
}));

vi.mock("@admin/admin-player/api/react-query-api/use-get-admin-players-suspense", () => ({
  useGetAdminPlayersSuspense: () => ({
    data: [
      { id: "1", name: "Active Player", status: "ACTIVE" },
      { id: "2", name: "Transferred Player", status: "TRANSFERRED" },
      { id: "3", name: "Retired Player", status: "RETIRED" },
    ],
  }),
}));

vi.mock("@admin/admin-player/admin-player-image-tool/components/admin-player-image-tool", () => ({
  default: () => <div data-testid="player-image-tool" />,
}));

vi.mock("@admin/admin-player/components/modal/admin-player-add-modal", () => ({
  AdminPlayerAddModal: () => null,
}));

vi.mock("@admin/admin-player/components/modal/admin-player-edit-modal", () => ({
  AdminPlayerEditModal: () => null,
}));

vi.mock("@admin/admin-transfer/components/admin-transfer", () => ({
  default: () => <div data-testid="admin-transfer" />,
}));

vi.mock("@admin/admin-player/components/error/admin-player-modal-error-fallback", () => ({
  default: () => <div>모달 오류</div>,
}));

vi.mock("@admin/admin-player/components/skeleton/admin-player-modal-skeleton", () => ({
  default: () => <div>모달 불러오는 중</div>,
}));

vi.mock("@shared/provider/react-query-boundary", () => ({
  default: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

vi.mock("@admin/admin-transfer/components/modal/admin-transfer-add-modal", () => ({
  AdminTransferAddModal: ({ player, action }: { player: { id: string }; action: string }) => (
    <div data-testid="transfer-form">
      {player.id}:{action}
    </div>
  ),
}));
vi.mock("@admin/admin-player/components/modal/admin-player-history-modal", () => ({
  AdminPlayerHistoryModal: () => null,
}));

describe("AdminPlayer", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });
  it("현재 상태별 선수만 표시한다", () => {
    render(<AdminPlayer />);
    expect(screen.getByText("Active Player")).toBeInTheDocument();
    expect(screen.queryByText("Transferred Player")).not.toBeInTheDocument();
    expect(screen.queryByText("Retired Player")).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole("radio", { name: "이적 선수" }));
    expect(screen.getByText("Transferred Player")).toBeInTheDocument();
    expect(screen.queryByText("Active Player")).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole("radio", { name: "은퇴 선수" }));
    expect(screen.getByText("Retired Player")).toBeInTheDocument();
    expect(screen.queryByText("Transferred Player")).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "은퇴 처리" })).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: "복귀 처리" })).toBeInTheDocument();
  });
  it("기존 이적 주소는 이적 선수 목록을 연다", () => {
    render(<AdminPlayer initialView="transfers" />);
    expect(screen.getByRole("radio", { name: "이적 선수" })).toHaveAttribute("aria-checked", "true");
    expect(screen.getByText("Transferred Player")).toBeInTheDocument();
  });
  it.each([
    ["이적 처리", "transfer"],
    ["은퇴 처리", "retire"],
  ])("%s 버튼에 선택 선수를 전달한다", (label, action) => {
    render(<AdminPlayer />);
    fireEvent.click(screen.getByRole("button", { name: label }));
    const config = modalOpen.mock.calls[0][0];
    render(config.content(vi.fn()));
    expect(screen.getByTestId("transfer-form")).toHaveTextContent("1:" + action);
  });
});
