import PageLoading from "./page-loading";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

describe("PageLoading 렌더링 테스트", () => {
  it("로딩 컨테이너와 브랜드 문구가 렌더링된다", () => {
    render(<PageLoading />);

    expect(screen.getByTestId("page-loading")).toBeInTheDocument();
    expect(screen.getByText("보돌코 스코어드")).toBeInTheDocument();
    expect(screen.getByText("불러오는 중...")).toBeInTheDocument();
  });
});
