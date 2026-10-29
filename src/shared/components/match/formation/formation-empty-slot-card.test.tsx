import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import FormationEmptySlotCard from "@shared/components/match/formation/formation-empty-slot-card";

describe("FormationEmptySlotCard", () => {
  it("자리 이름을 찍고, 기본 접근성 이름은 '{자리} 비어 있음' 이다", () => {
    const onClick = vi.fn();
    render(<FormationEmptySlotCard label="ST" onClick={onClick} />);

    fireEvent.click(screen.getByRole("button", { name: "ST 비어 있음" }));

    expect(screen.getByText("ST")).toBeInTheDocument();
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  // 후보 + 칸처럼 "빈 자리" 가 아닌 추가 버튼으로 쓸 때
  it("actionLabel 을 주면 그 문구를 접근성 이름으로 쓴다", () => {
    render(<FormationEmptySlotCard label="후보" actionLabel="후보 선수 추가" onClick={vi.fn()} />);

    expect(screen.getByRole("button", { name: "후보 선수 추가" })).toBeInTheDocument();
  });
});
