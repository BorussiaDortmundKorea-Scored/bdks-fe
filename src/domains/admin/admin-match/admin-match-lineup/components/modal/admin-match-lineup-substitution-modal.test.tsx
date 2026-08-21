import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import type { IMatchLineup } from "@admin/admin-match/admin-match-lineup/api/admin-match-lineup-api";
import { AdminMatchLineupSubstitutionModal } from "@admin/admin-match/admin-match-lineup/components/modal/admin-match-lineup-substitution-modal";

const { substituteMock, toastMock, isSubstitutingRef } = vi.hoisted(() => ({
  substituteMock: vi.fn(),
  toastMock: vi.fn(),
  isSubstitutingRef: { current: false },
}));

vi.mock("@admin/admin-match/admin-match-lineup/api/react-query-api/use-substitute-match-lineup", () => ({
  useSubstituteMatchLineup: () => ({ mutateAsync: substituteMock, isPending: isSubstitutingRef.current }),
}));

vi.mock("@admin/admin-match/admin-match-lineup/api/react-query-api/use-get-all-players-suspense", () => ({
  useGetAllPlayersSuspense: () => ({
    data: [
      { id: "player-1", name: "Player One", korean_name: "선수일", jersey_number: 7 },
      { id: "player-2", name: "Player Two", korean_name: "선수이", jersey_number: 9 },
    ],
  }),
}));

vi.mock("@youngduck/yd-ui/Overlays", () => ({
  useOverlay: () => ({ toast: toastMock }),
}));

const mockLineup = {
  id: 1,
  match_id: "match-1",
  player_id: "player-1",
  player_name: "Player One",
  player_korean_name: "선수일",
} as unknown as IMatchLineup;

describe("AdminMatchLineupSubstitutionModal", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    isSubstitutingRef.current = false;
    substituteMock.mockResolvedValue(undefined);
  });

  it("제목·대상 선수명·버튼을 렌더링한다", () => {
    render(<AdminMatchLineupSubstitutionModal matchId="match-1" lineup={mockLineup} onClose={vi.fn()} />);

    expect(screen.getByText("선수 교체")).toBeInTheDocument();
    expect(screen.getByText("선수일 선수를 교체합니다.")).toBeInTheDocument();
    expect(screen.getByText("교체로 들어올 선수 *")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "교체 적용" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "취소" })).toBeInTheDocument();
  });

  it("취소 클릭 시 교체 없이 모달을 닫는다", () => {
    const onClose = vi.fn();
    render(<AdminMatchLineupSubstitutionModal matchId="match-1" lineup={mockLineup} onClose={onClose} />);

    fireEvent.click(screen.getByRole("button", { name: "취소" }));

    expect(substituteMock).not.toHaveBeenCalled();
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("교체 시간이 비어 있으면 토스트를 띄우고 교체하지 않는다", async () => {
    const onClose = vi.fn();
    render(<AdminMatchLineupSubstitutionModal matchId="match-1" lineup={mockLineup} onClose={onClose} />);

    fireEvent.click(screen.getByRole("button", { name: "교체 적용" }));

    await waitFor(() =>
      expect(toastMock).toHaveBeenCalledWith({ content: "교체 시간은 1분 이상 120분 이하로 입력해주세요." }),
    );
    expect(substituteMock).not.toHaveBeenCalled();
    expect(onClose).not.toHaveBeenCalled();
  });

  it("교체 진행 중이면 교체 적용 버튼이 비활성화된다", () => {
    isSubstitutingRef.current = true;
    render(<AdminMatchLineupSubstitutionModal matchId="match-1" lineup={mockLineup} onClose={vi.fn()} />);

    expect(screen.getByRole("button", { name: "교체 적용 중..." })).toBeDisabled();
  });
});
