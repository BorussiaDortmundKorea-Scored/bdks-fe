import { MemoryRouter } from "react-router-dom";

import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import FormationPlayerCard from "@shared/components/match/formation/formation-player-card";
import { type IFormationPlayer } from "@shared/components/match/formation/formation-types";

const PLAYER: IFormationPlayer = {
  playerId: "p1",
  name: "그레고르 코벨",
  imageUrl: "https://example.com/kobel.png",
  rating: 7.5,
};

describe("FormationPlayerCard", () => {
  it("to 를 주면 평점 입력 링크가 되고 평점 배지를 그린다", () => {
    render(
      <MemoryRouter>
        <FormationPlayerCard player={PLAYER} to="/ratings/p1" />
      </MemoryRouter>,
    );

    expect(screen.getByRole("link", { name: "그레고르 코벨 평점 입력" })).toHaveAttribute("href", "/ratings/p1");
    expect(screen.getByText("7.5")).toBeInTheDocument();
  });

  // 관리자 라인업 보드: 카드 전체가 버튼이고 평점은 없다
  it("onClick 을 주면 선수 이름을 가진 버튼이 되고 누르면 onClick 을 부른다", () => {
    const onClick = vi.fn();
    render(<FormationPlayerCard player={{ ...PLAYER, rating: undefined }} onClick={onClick} />);

    fireEvent.click(screen.getByRole("button", { name: "그레고르 코벨" }));

    expect(onClick).toHaveBeenCalledTimes(1);
    expect(screen.queryByRole("link")).not.toBeInTheDocument();
    expect(screen.queryByText("7.5")).not.toBeInTheDocument();
  });

  it("골과 도움을 넘기면 우상단 배지로 함께 알린다", () => {
    render(<FormationPlayerCard player={{ ...PLAYER, goals: 1, assists: 2 }} />);

    expect(screen.getByText("1골 2도움")).toBeInTheDocument();
    expect(screen.getByText("A2")).toBeInTheDocument();
  });

  it("도움만 있으면 골 없이 도움만 알린다", () => {
    render(<FormationPlayerCard player={{ ...PLAYER, assists: 1 }} />);

    expect(screen.getByText("1도움")).toBeInTheDocument();
    expect(screen.getByText("A")).toBeInTheDocument();
  });
});
