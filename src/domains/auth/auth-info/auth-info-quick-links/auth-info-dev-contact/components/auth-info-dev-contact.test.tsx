
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";

import AuthInfoDevContact from "@auth/auth-info/auth-info-quick-links/auth-info-dev-contact/components/auth-info-dev-contact";
import { getKakaoUserAuthMock, getAnonymousUserAuthMock } from "@shared/mocks/constants/user-mock-data";

// emailjs 모킹
const mockEmailjsSend = vi.fn();

vi.mock("@emailjs/browser", () => ({
  default: {
    send: (...args: unknown[]) => mockEmailjsSend(...args),
  },
}));

// useAuth 모킹
const mockUseAuth = vi.fn();

vi.mock("@auth/contexts/AuthContext", () => ({
  useAuth: () => mockUseAuth(),
}));

// LayoutWithHeaderFooter 모킹
vi.mock("@shared/provider/layout-with-header-footer", () => ({
  default: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

const renderComponent = () => render(<AuthInfoDevContact />);

const fillForm = async (title: string, message: string) => {
  await userEvent.type(screen.getByPlaceholderText("제목"), title);
  await userEvent.type(
    screen.getByPlaceholderText("서비스 사용 중 불편한 점이나 소중한 아이디어가 있다면 편하게 남겨 주세요."),
    message,
  );
};

describe("AuthInfoDevContact", () => {
  beforeEach(() => {
    vi.stubEnv("VITE_EMAILJS_SERVICE_ID", "test-service-id");
    vi.stubEnv("VITE_EMAILJS_TEMPLATE_ID", "test-template-id");
    vi.stubEnv("VITE_EMAILJS_PUBLIC_KEY", "test-public-key");
    mockEmailjsSend.mockResolvedValue({});
  });

  afterEach(() => {
    vi.unstubAllEnvs();
    vi.clearAllMocks();
  });

  it("폼 요소들이 렌더링된다", () => {
    mockUseAuth.mockReturnValue(getKakaoUserAuthMock());
    renderComponent();

    expect(screen.getByPlaceholderText("제목")).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText("서비스 사용 중 불편한 점이나 소중한 아이디어가 있다면 편하게 남겨 주세요."),
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "문의하기" })).toBeInTheDocument();
  });

  it("제목과 메시지가 비어있으면 버튼이 disabled이다", () => {
    mockUseAuth.mockReturnValue(getKakaoUserAuthMock());
    renderComponent();

    expect(screen.getByRole("button", { name: "문의하기" })).toBeDisabled();
  });

  it("제목만 입력하면 버튼이 disabled이다", async () => {
    mockUseAuth.mockReturnValue(getKakaoUserAuthMock());
    renderComponent();

    await userEvent.type(screen.getByPlaceholderText("제목"), "테스트 제목");

    expect(screen.getByRole("button", { name: "문의하기" })).toBeDisabled();
  });

  it("제목과 메시지를 모두 입력하면 버튼이 활성화된다", async () => {
    mockUseAuth.mockReturnValue(getKakaoUserAuthMock());
    renderComponent();

    await fillForm("테스트 제목", "테스트 내용입니다.");

    expect(screen.getByRole("button", { name: "문의하기" })).toBeEnabled();
  });

  it("폼 제출 시 emailjs.send를 호출한다", async () => {
    mockUseAuth.mockReturnValue({
      ...getKakaoUserAuthMock(),
      profile: { nickname: "테스트유저" },
    });
    renderComponent();

    await fillForm("테스트 제목", "테스트 내용입니다.");
    await userEvent.click(screen.getByRole("button", { name: "문의하기" }));

    await waitFor(() => {
      expect(mockEmailjsSend).toHaveBeenCalledWith(
        "test-service-id",
        "test-template-id",
        expect.objectContaining({
          title: "테스트 제목",
          message: "테스트 내용입니다.",
        }),
        "test-public-key",
      );
    });
  });

  it("전송 성공 시 성공 메시지를 노출하고 폼을 초기화한다", async () => {
    mockUseAuth.mockReturnValue(getKakaoUserAuthMock());
    renderComponent();

    await fillForm("테스트 제목", "테스트 내용입니다.");
    await userEvent.click(screen.getByRole("button", { name: "문의하기" }));

    expect(await screen.findByText("소중한 의견 감사합니다! 메일이 정상적으로 전송되었어요.")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("제목")).toHaveValue("");
    expect(
      screen.getByPlaceholderText("서비스 사용 중 불편한 점이나 소중한 아이디어가 있다면 편하게 남겨 주세요."),
    ).toHaveValue("");
  });

  it("전송 실패 시 에러 메시지를 노출한다", async () => {
    mockEmailjsSend.mockRejectedValue(new Error("network error"));
    mockUseAuth.mockReturnValue(getKakaoUserAuthMock());
    renderComponent();

    await fillForm("테스트 제목", "테스트 내용입니다.");
    await userEvent.click(screen.getByRole("button", { name: "문의하기" }));

    expect(
      await screen.findByText(/메일 전송에 실패했습니다/),
    ).toBeInTheDocument();
  });

  it("환경변수가 없으면 에러 메시지를 노출한다", async () => {
    vi.stubEnv("VITE_EMAILJS_SERVICE_ID", "");
    mockUseAuth.mockReturnValue(getKakaoUserAuthMock());
    renderComponent();

    await fillForm("테스트 제목", "테스트 내용입니다.");
    await userEvent.click(screen.getByRole("button", { name: "문의하기" }));

    expect(
      await screen.findByText(/메일 전송에 실패했습니다/),
    ).toBeInTheDocument();
    expect(mockEmailjsSend).not.toHaveBeenCalled();
  });

  it("익명 사용자는 name이 '익명'으로 전송된다", async () => {
    mockUseAuth.mockReturnValue({
      ...getAnonymousUserAuthMock(),
      profile: null,
    });
    renderComponent();

    await fillForm("테스트 제목", "테스트 내용입니다.");
    await userEvent.click(screen.getByRole("button", { name: "문의하기" }));

    await waitFor(() => {
      expect(mockEmailjsSend).toHaveBeenCalledWith(
        expect.any(String),
        expect.any(String),
        expect.objectContaining({ name: "익명" }),
        expect.any(String),
      );
    });
  });
});
