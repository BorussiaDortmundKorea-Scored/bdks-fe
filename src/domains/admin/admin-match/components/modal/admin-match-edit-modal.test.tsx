import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import type { IMatch } from "@admin/admin-match/api/admin-match-api";
import { AdminMatchEditModal } from "@admin/admin-match/components/modal/admin-match-edit-modal";

const updateMatchMock = vi.fn();

vi.mock("@admin/admin-competition/api/react-query-api/use-get-all-competitions-suspense", () => ({
  useGetAllCompetitionsSuspense: () => ({
    data: [{ id: "comp-1", name: "분데스리가", season: "2025-26" }],
  }),
}));

vi.mock("@admin/admin-team/api/react-query-api/use-get-all-teams-suspense", () => ({
  useGetAllTeamsSuspense: () => ({
    data: [{ id: "team-1", name: "바이에른 뮌헨" }],
  }),
}));

vi.mock("@admin/admin-match/api/react-query-api/use-update-match", () => ({
  useUpdateMatch: () => ({ mutateAsync: updateMatchMock, isPending: false }),
}));

const mockMatch = {
  id: "match-1",
  competition_id: "comp-1",
  opponent_team_id: "team-1",
  competition_name: "분데스리가",
  opponent_team_name: "바이에른 뮌헨",
  home_away: "HOME",
  our_score: 2,
  opponent_score: 1,
  formation: "4-3-3",
  is_live: false,
  round_name: "28R",
  match_date: "2025-11-08",
  match_start_time: "2025-11-08T05:30:00.000Z",
  first_half_end_time: "2025-11-08T06:15:00.000Z",
  second_half_start_time: "2025-11-08T06:30:00.000Z",
  second_half_end_time: "2025-11-08T07:15:00.000Z",
} as unknown as IMatch;

describe("AdminMatchEditModal", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    updateMatchMock.mockResolvedValue(undefined);
  });

  it("제목·필드 라벨·버튼을 렌더링한다", () => {
    render(<AdminMatchEditModal match={mockMatch} onClose={vi.fn()} />);

    expect(screen.getByText("경기 수정")).toBeInTheDocument();
    expect(screen.getByText("대회 *")).toBeInTheDocument();
    expect(screen.getByText("상대팀 *")).toBeInTheDocument();
    expect(screen.getByText("포메이션")).toBeInTheDocument();
    expect(screen.getByText("경기 시간 설정")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "수정" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "취소" })).toBeInTheDocument();
  });

  it("전달된 match 값으로 폼 필드가 초기화된다", () => {
    render(<AdminMatchEditModal match={mockMatch} onClose={vi.fn()} />);

    // 포메이션 값이 초기화되어 표시된다
    expect(screen.getByDisplayValue("4-3-3")).toBeInTheDocument();
    // 라운드명 값이 초기화되어 표시된다
    expect(screen.getByDisplayValue("28R")).toBeInTheDocument();
  });

  it("포메이션 입력값을 변경할 수 있다", () => {
    render(<AdminMatchEditModal match={mockMatch} onClose={vi.fn()} />);

    const formationInput = screen.getByDisplayValue("4-3-3");
    fireEvent.change(formationInput, { target: { value: "4-2-3-1" } });

    expect(screen.getByDisplayValue("4-2-3-1")).toBeInTheDocument();
  });

  it("취소 클릭 시 수정 없이 모달을 닫는다", () => {
    const onClose = vi.fn();
    render(<AdminMatchEditModal match={mockMatch} onClose={onClose} />);

    fireEvent.click(screen.getByRole("button", { name: "취소" }));

    expect(updateMatchMock).not.toHaveBeenCalled();
    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
