import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { AdminTeamEditModal } from "@admin/admin-team/components/modal/admin-team-edit-modal";

const mutateAsyncMock = vi.fn();

vi.mock("@admin/admin-team/api/react-query-api/use-update-team", () => ({
  useUpdateTeam: () => ({ mutateAsync: mutateAsyncMock, isPending: false }),
}));

// data는 안정적인 참조여야 한다. 매 렌더마다 새 배열을 반환하면
// countryOptions useMemo가 갱신되고 모달의 useEffect가 무한 렌더를 유발한다.
vi.mock("@admin/admin-country/api/react-query-api/use-get-all-countries-suspense", () => {
  const countries = [{ id: 1, name: "독일" }];
  return { useGetAllCountriesSuspense: () => ({ data: countries }) };
});

const team = {
  id: 10,
  name: "도르트문트",
  country_id: 1,
  logo_image_url: null,
} as never;

describe("AdminTeamEditModal", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mutateAsyncMock.mockResolvedValue(undefined);
  });

  it("제목·기존값이 채워진 입력·버튼을 렌더링한다", () => {
    render(<AdminTeamEditModal team={team} onClose={vi.fn()} />);

    expect(screen.getByText("팀 수정")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("팀명을 입력하세요")).toHaveValue("도르트문트");
    expect(screen.getByRole("button", { name: "수정" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "취소" })).toBeInTheDocument();
  });

  it("팀명을 비우면 수정 버튼이 비활성화된다", () => {
    render(<AdminTeamEditModal team={team} onClose={vi.fn()} />);

    expect(screen.getByRole("button", { name: "수정" })).toBeEnabled();

    fireEvent.change(screen.getByPlaceholderText("팀명을 입력하세요"), { target: { value: "" } });

    expect(screen.getByRole("button", { name: "수정" })).toBeDisabled();
  });

  it("수정 클릭 시 해당 팀 id·팀명으로 갱신하고 모달을 닫는다", async () => {
    const onClose = vi.fn();
    render(<AdminTeamEditModal team={team} onClose={onClose} />);

    fireEvent.change(screen.getByPlaceholderText("팀명을 입력하세요"), { target: { value: "BVB" } });
    fireEvent.click(screen.getByRole("button", { name: "수정" }));

    await waitFor(() =>
      expect(mutateAsyncMock).toHaveBeenCalledWith(expect.objectContaining({ id: 10, name: "BVB" })),
    );
    await waitFor(() => expect(onClose).toHaveBeenCalledTimes(1));
  });

  it("취소 클릭 시 갱신 없이 모달을 닫는다", () => {
    const onClose = vi.fn();
    render(<AdminTeamEditModal team={team} onClose={onClose} />);

    fireEvent.click(screen.getByRole("button", { name: "취소" }));

    expect(mutateAsyncMock).not.toHaveBeenCalled();
    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
