import { render, screen } from "@testing-library/react";
import { vi } from "vitest";

import RatingGaugeInput from "@matches/matches-lastest/matches-lastest-player-rating/rating-gauge-input/components/rating-gauge-input";

describe("평점 게이지 입력 컴포넌트 렌더링 테스트", () => {
  it("초기값이 올바르게 렌더링되어야한다", () => {
    render(<RatingGaugeInput value={6.0} onChangeEnd={vi.fn()} disabled={false} />);

    expect(screen.getByText("6.0")).toBeInTheDocument();
    expect(screen.getByText("평점 입력하기")).toBeInTheDocument();
  });

  it("최소/최대/중간 라벨이 표시되어야한다", () => {
    render(<RatingGaugeInput value={5.0} onChangeEnd={vi.fn()} disabled={false} />);

    expect(screen.getByText("0.0")).toBeInTheDocument();
    expect(screen.getAllByText("5.0")).toHaveLength(2);
    expect(screen.getByText("10.0")).toBeInTheDocument();
  });
});
