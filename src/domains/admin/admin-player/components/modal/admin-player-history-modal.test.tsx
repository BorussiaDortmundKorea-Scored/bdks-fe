import { fireEvent, render, screen, within } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import type { IPlayer } from "@admin/admin-player/api/admin-player-api";
import { AdminPlayerHistoryModal } from "@admin/admin-player/components/modal/admin-player-history-modal";

const { transfers } = vi.hoisted(() => ({ transfers: { current: [] as unknown[] } }));
vi.mock("@admin/admin-transfer/api/react-query-api/use-get-transfers-by-season-suspense", () => ({
  useGetAllTransfersSuspense: () => ({ data: transfers.current }),
}));

const player = { id: "p1", name: "Marco Reus", korean_name: "로이스" } as IPlayer;

const row = (over: Record<string, unknown>) => ({
  id: "t",
  player_id: "p1",
  direction: "OUT",
  transfer_type: "PERMANENT",
  counterpart_club_name: null,
  transfer_date: null,
  euro_fee: null,
  created_at: "2026-01-01T00:00:00Z",
  ...over,
});

describe("AdminPlayerHistoryModal", () => {
  it("해당 선수 이력만 최신순으로 보여주고, 은퇴는 상대 클럽·이적금액을 숨긴다", () => {
    transfers.current = [
      row({
        id: "old",
        direction: "IN",
        counterpart_club_name: "묀헨글라트바흐",
        transfer_date: "2012-07-01",
        euro_fee: 17_100_000,
      }),
      row({ id: "retire", transfer_type: "RETIRED", transfer_date: "2026-06-30" }),
      row({ id: "other", player_id: "p2", counterpart_club_name: "다른 선수 클럽", transfer_date: "2020-01-01" }),
    ];
    render(<AdminPlayerHistoryModal player={player} onClose={vi.fn()} />);

    expect(screen.getByText("로이스 이적·은퇴 이력")).toBeInTheDocument();
    const items = screen.getAllByRole("listitem");
    expect(items).toHaveLength(2);
    expect(within(items[0]).getByText("2026-06-30")).toBeInTheDocument();
    expect(within(items[0]).getByText("은퇴")).toBeInTheDocument();
    expect(within(items[0]).queryByText(/비공개/)).not.toBeInTheDocument();
    expect(within(items[1]).getByText("영입")).toBeInTheDocument();
    expect(within(items[1]).getByText(/묀헨글라트바흐/)).toBeInTheDocument();
    expect(screen.queryByText(/다른 선수 클럽/)).not.toBeInTheDocument();
  });

  it("이력이 없으면 빈 상태를 보여주고 닫기로 모달을 닫는다", () => {
    transfers.current = [];
    const onClose = vi.fn();
    render(<AdminPlayerHistoryModal player={player} onClose={onClose} />);

    expect(screen.getByText("등록된 이력이 없습니다.")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "닫기" }));
    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
