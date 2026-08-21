import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { AdminTeamAddModal } from "@admin/admin-team/components/modal/admin-team-add-modal";

const mutateAsyncMock = vi.fn();

vi.mock("@admin/admin-team/api/react-query-api/use-create-team", () => ({
  useCreateTeam: () => ({ mutateAsync: mutateAsyncMock, isPending: false }),
}));

vi.mock("@admin/admin-country/api/react-query-api/use-get-all-countries-suspense", () => ({
  useGetAllCountriesSuspense: () => ({ data: [{ id: 1, name: "독일" }] }),
}));

describe("AdminTeamAddModal", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mutateAsyncMock.mockResolvedValue(undefined);
  });

  it("제목·입력·버튼을 렌더링한다", () => {
    render(<AdminTeamAddModal onClose={vi.fn()} />);

    expect(screen.getByText("새 팀 추가")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("팀명을 입력하세요")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("예: barcelona (확장자 생략 시 .png)")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "추가" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "취소" })).toBeInTheDocument();
  });

  it("팀명이 비어 있으면 추가 버튼이 비활성화된다", () => {
    render(<AdminTeamAddModal onClose={vi.fn()} />);

    expect(screen.getByRole("button", { name: "추가" })).toBeDisabled();

    fireEvent.change(screen.getByPlaceholderText("팀명을 입력하세요"), { target: { value: "FC 테스트" } });

    expect(screen.getByRole("button", { name: "추가" })).toBeEnabled();
  });

  it("팀명만 입력해 추가하면 국가·로고 없이 등록하고 모달을 닫는다", async () => {
    const onClose = vi.fn();
    render(<AdminTeamAddModal onClose={onClose} />);

    fireEvent.change(screen.getByPlaceholderText("팀명을 입력하세요"), { target: { value: "FC 테스트" } });
    fireEvent.click(screen.getByRole("button", { name: "추가" }));

    await waitFor(() =>
      expect(mutateAsyncMock).toHaveBeenCalledWith({
        name: "FC 테스트",
        country_id: null,
        logo_image_url: undefined,
      }),
    );
    await waitFor(() => expect(onClose).toHaveBeenCalledTimes(1));
  });

  it("취소 클릭 시 등록 없이 모달을 닫는다", () => {
    const onClose = vi.fn();
    render(<AdminTeamAddModal onClose={onClose} />);

    fireEvent.click(screen.getByRole("button", { name: "취소" }));

    expect(mutateAsyncMock).not.toHaveBeenCalled();
    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
