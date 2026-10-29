import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import FormationBoardFrame from "@shared/components/match/formation/formation-board-frame";

describe("FormationBoardFrame", () => {
  it("헤더(제목 · 부제 · 우측 영역)와 children 을 그린다", () => {
    render(
      <FormationBoardFrame
        title="도르트문트(H) vs 바이에른 뮌헨"
        subtitle="DFL 슈퍼컵"
        headerRight={<span>4-2-3-1</span>}
        viewType="PLAY"
        onViewTypeChange={vi.fn()}
      >
        <p>보드 본문</p>
      </FormationBoardFrame>,
    );

    expect(screen.getByText("도르트문트(H) vs 바이에른 뮌헨")).toBeInTheDocument();
    expect(screen.getByText("DFL 슈퍼컵")).toBeInTheDocument();
    expect(screen.getByText("4-2-3-1")).toBeInTheDocument();
    expect(screen.getByText("보드 본문")).toBeInTheDocument();
  });

  it("선발/교체 토글을 누르면 해당 뷰 타입을 알린다", () => {
    const onViewTypeChange = vi.fn();
    render(
      <FormationBoardFrame title="" subtitle="" headerRight={null} viewType="PLAY" onViewTypeChange={onViewTypeChange}>
        {null}
      </FormationBoardFrame>,
    );

    fireEvent.click(screen.getByRole("button", { name: "교체" }));
    fireEvent.click(screen.getByRole("button", { name: "선발" }));

    expect(onViewTypeChange).toHaveBeenNthCalledWith(1, "NOT_PLAY");
    expect(onViewTypeChange).toHaveBeenNthCalledWith(2, "PLAY");
  });
});
