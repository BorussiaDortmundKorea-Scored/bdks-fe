import { render, screen } from "@testing-library/react";
import PlayerDb from "./player-db";

describe("선수 누적평점 DB 컴포넌트 렌더링 테스트", () => {
  it("이미지 렌더링 테스트", () => {
    render(<PlayerDb />);

    expect(screen.getByText("선수목록데스네")).toBeInTheDocument();
  });
});

describe("선수 누적평점 DB 컴포넌트 기능 테스트", () => {
  it("가로스크롤이 되어야함", () => {
    render(<PlayerDb />);
  });

  it("익명로그인유저: 클릭시 이용불가팝업", () => {
    render(<PlayerDb />);
  });

  it("로그인유저: 클릭시 선수 상세 페이지이동", () => {
    render(<PlayerDb />);
  });
});
