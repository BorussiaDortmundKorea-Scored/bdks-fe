/**
 * 작성자: KYD
 * 기능: 구단 우승 트로피 진열 컴포넌트 렌더링 테스트 (정적 데이터)
 */
import DashboardTrophy from "./dashboard-trophy";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

describe("우승 트로피 진열 컴포넌트 렌더링 테스트", () => {
  it("제목과 트로피 항목(대회명·횟수)이 렌더링된다", () => {
    render(<DashboardTrophy />);

    expect(screen.getByText("우승 기록")).toBeInTheDocument();
    expect(screen.getByText("분데스리가")).toBeInTheDocument();
    expect(screen.getByText("챔피언스리그")).toBeInTheDocument();
    // 트로피 이미지가 6종 렌더
    expect(screen.getAllByRole("img")).toHaveLength(6);
  });
});
