import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import AdminMatchBulkAddRow from "@admin/admin-match/components/modal/admin-match-bulk-add-row";

const competitionOptions = [{ label: "comp-1", value: "분데스리가 (2025-26)" }];
const teamOptions = [{ label: "team-1", value: "바이에른 뮌헨" }];

const baseProps = {
  index: 0,
  row: { match_start_time: "", round_name: "" },
  competitionOptions,
  teamOptions,
  onRowChange: vi.fn(),
  onHooksReady: vi.fn(),
};

describe("AdminMatchBulkAddRow", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("행 번호(index+1)와 필드 라벨을 렌더링한다", () => {
    render(<AdminMatchBulkAddRow {...baseProps} />);

    expect(screen.getByText("경기 1")).toBeInTheDocument();
    expect(screen.getByText("대회 *")).toBeInTheDocument();
    expect(screen.getByText("상대팀 *")).toBeInTheDocument();
    expect(screen.getByText("경기 시작 시간 (한국기준) *")).toBeInTheDocument();
    expect(screen.getByText("홈/어웨이 *")).toBeInTheDocument();
  });

  it("마운트 시 onHooksReady를 호출한다", () => {
    const onHooksReady = vi.fn();
    render(<AdminMatchBulkAddRow {...baseProps} onHooksReady={onHooksReady} />);

    expect(onHooksReady).toHaveBeenCalled();
    expect(onHooksReady).toHaveBeenCalledWith(
      0,
      expect.objectContaining({ homeAwayLabel: expect.any(String) }),
    );
  });

  it("라운드명 입력 시 onRowChange를 호출한다", () => {
    const onRowChange = vi.fn();
    render(<AdminMatchBulkAddRow {...baseProps} onRowChange={onRowChange} />);

    const roundInput = screen.getByPlaceholderText("예: 28R");
    fireEvent.change(roundInput, { target: { value: "28R" } });

    expect(onRowChange).toHaveBeenCalledWith(0, "round_name", "28R");
  });

  it("시작 시간 입력 시 onRowChange를 호출한다", () => {
    const onRowChange = vi.fn();
    const { container } = render(<AdminMatchBulkAddRow {...baseProps} onRowChange={onRowChange} />);

    const dateInput = container.querySelector('input[type="datetime-local"]') as HTMLInputElement;
    fireEvent.change(dateInput, { target: { value: "2025-11-08T14:30" } });

    expect(onRowChange).toHaveBeenCalledWith(0, "match_start_time", "2025-11-08T14:30");
  });

  it("row.match_start_time가 있으면 경기일 안내를 노출한다", () => {
    render(<AdminMatchBulkAddRow {...baseProps} row={{ match_start_time: "2025-11-08T14:30", round_name: "" }} />);

    expect(screen.getByText(/경기일: 2025-11-08/)).toBeInTheDocument();
  });
});
