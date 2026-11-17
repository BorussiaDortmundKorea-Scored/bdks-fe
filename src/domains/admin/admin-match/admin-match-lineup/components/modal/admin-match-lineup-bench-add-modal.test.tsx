import { fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { AdminMatchLineupBenchAddModal } from "@admin/admin-match/admin-match-lineup/components/modal/admin-match-lineup-bench-add-modal";

const { addMock } = vi.hoisted(() => ({ addMock: vi.fn() }));

vi.mock("@admin/admin-match/admin-match-lineup/api/react-query-api/use-add-match-bench-players", () => ({
  useAddMatchBenchPlayers: () => ({ mutateAsync: addMock, isPending: false }),
}));
vi.mock("@admin/admin-match/admin-match-lineup/api/react-query-api/use-get-all-players-suspense", () => ({
  useGetAllPlayersSuspense: () => ({
    data: [
      { id: "p-gk", name: "Kobel", korean_name: "코벨", jersey_number: 1, is_current_squad: true },
      { id: "p-sub", name: "Beier", korean_name: "바이어", jersey_number: 14, is_current_squad: true },
      { id: "p-free", name: "Adeyemi", korean_name: "아데예미", jersey_number: 27, is_current_squad: true },
      { id: "p-free2", name: "Brandt", korean_name: "브란트", jersey_number: 10, is_current_squad: true },
      { id: "p-left", name: "Reus", korean_name: "로이스", jersey_number: 11, is_current_squad: false },
      { id: "p-retired", name: "Hummels", korean_name: "훔멜스", jersey_number: 15, is_current_squad: false },
    ],
  }),
}));
vi.mock("@admin/admin-match/admin-match-lineup/api/react-query-api/use-get-match-lineups-suspense", () => ({
  useGetMatchLineupsSuspense: () => ({
    data: [
      { player_id: "p-gk", lineup_type: "STARTING", sub_in_minute: null },
      { player_id: "p-sub", lineup_type: "BENCH", sub_in_minute: null },
    ],
  }),
}));

const getOptionNames = () =>
  within(screen.getByRole("group", { name: "추가할 선수" }))
    .getAllByRole("checkbox")
    .map((checkbox) => checkbox.closest("label")?.textContent ?? "");

describe("AdminMatchLineupBenchAddModal", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    addMock.mockResolvedValue(2);
  });

  it("현재 후보 수를 보여주고, 이미 명단에 있는 선수는 목록에 없다", () => {
    render(<AdminMatchLineupBenchAddModal matchId="match-1" onClose={vi.fn()} />);

    expect(screen.getByText("현재 후보 1명")).toBeInTheDocument();
    expect(getOptionNames()).toEqual(["아데예미 (27번)", "브란트 (10번)"]);
  });

  it("이적·은퇴한 선수는 목록에서 제외하고 다시 표시할 수 없다", () => {
    render(<AdminMatchLineupBenchAddModal matchId="match-1" onClose={vi.fn()} />);

    expect(getOptionNames()).not.toContain("로이스 (11번) · 이적");
    expect(getOptionNames()).not.toContain("훔멜스 (15번) · 이적");
    expect(screen.queryByText("이적한 선수도 보기")).not.toBeInTheDocument();
  });

  it("이름으로 좁혀 볼 수 있다", () => {
    render(<AdminMatchLineupBenchAddModal matchId="match-1" onClose={vi.fn()} />);

    fireEvent.change(screen.getByLabelText("이름으로 찾기"), { target: { value: "브란" } });

    expect(getOptionNames()).toEqual(["브란트 (10번)"]);
  });

  it("여러 명을 골라 한 번에 후보로 추가하고 닫는다", async () => {
    const onClose = vi.fn();
    render(<AdminMatchLineupBenchAddModal matchId="match-1" onClose={onClose} />);

    expect(screen.getByRole("button", { name: "추가" })).toBeDisabled();
    fireEvent.click(screen.getByText("아데예미 (27번)"));
    fireEvent.click(screen.getByText("브란트 (10번)"));
    fireEvent.click(screen.getByRole("button", { name: "2명 추가" }));

    await waitFor(() => expect(onClose).toHaveBeenCalled());
    expect(addMock).toHaveBeenCalledWith({ match_id: "match-1", player_ids: ["p-free", "p-free2"] });
  });
});
