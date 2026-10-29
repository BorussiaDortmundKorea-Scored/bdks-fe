import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import FormationLineLayout from "@shared/components/match/formation/formation-line-layout";

describe("FormationLineLayout", () => {
  it("line_number 오름차순으로 줄을 쌓고 줄 안은 받은 순서대로 그린다", () => {
    // 키를 일부러 섞어 넣어 객체 키 순서가 아니라 숫자 정렬로 그리는지 본다
    const lines = { 5: ["GK"], 1: ["ST"], 4: ["LB", "CB", "RB"] };

    const { container } = render(
      <FormationLineLayout lines={lines} getItemKey={(name) => name} renderItem={(name) => <span>{name}</span>} />,
    );

    const rows = Array.from(container.firstElementChild!.children).map((row) =>
      Array.from(row.children).map((cell) => cell.textContent),
    );
    expect(rows).toEqual([["ST"], ["LB", "CB", "RB"], ["GK"]]);
  });

  it("renderItem 이 돌려준 요소를 그대로 그린다", () => {
    render(
      <FormationLineLayout
        lines={{ 1: ["ST"] }}
        getItemKey={(name) => name}
        renderItem={(name) => <button type="button">{name} 추가</button>}
      />,
    );

    expect(screen.getByRole("button", { name: "ST 추가" })).toBeInTheDocument();
  });
});
