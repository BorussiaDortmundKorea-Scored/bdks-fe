import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import ModalFooter from "@shared/components/modal/modal-footer";
import { MODAL_SLOT_CONFIG } from "@shared/components/modal/modal-slot-config";
import ModalTitle from "@shared/components/modal/modal-title";

/** yd-ui 모달과 같은 뼈대: header(h2) · body · footer 가 한 다이얼로그 안에 형제로 있다 */
const FakeYdModal = ({ children }: { children: React.ReactNode }) => (
  <div role="dialog">
    <header data-testid="header">
      <h2>{MODAL_SLOT_CONFIG.title}</h2>
    </header>
    <div data-testid="body">{children}</div>
    <footer data-testid="footer">{MODAL_SLOT_CONFIG.footer}</footer>
  </div>
);

const Content = () => (
  <>
    <ModalTitle>선수 교체</ModalTitle>
    <p>본문</p>
    <ModalFooter>
      <button type="button">교체 적용</button>
    </ModalFooter>
  </>
);

describe("ModalTitle · ModalFooter", () => {
  it("슬롯이 있는 모달에서는 제목은 고정 헤더, 버튼은 고정 푸터로 옮겨 그린다", () => {
    render(
      <FakeYdModal>
        <Content />
      </FakeYdModal>,
    );

    expect(screen.getByRole("heading", { name: "선수 교체" })).toBeInTheDocument();
    expect(within(screen.getByTestId("header")).getByText("선수 교체")).toBeInTheDocument();
    expect(within(screen.getByTestId("footer")).getByRole("button", { name: "교체 적용" })).toBeInTheDocument();
    expect(within(screen.getByTestId("body")).queryByText("선수 교체")).not.toBeInTheDocument();
    expect(within(screen.getByTestId("body")).queryByRole("button")).not.toBeInTheDocument();
  });

  it("슬롯이 없으면 본문 제자리에 그린다", () => {
    render(<Content />);

    expect(screen.getByRole("heading", { name: "선수 교체" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "교체 적용" })).toBeInTheDocument();
  });
});
