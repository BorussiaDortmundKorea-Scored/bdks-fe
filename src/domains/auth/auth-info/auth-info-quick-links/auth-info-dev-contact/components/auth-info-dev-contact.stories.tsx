import AuthInfoDevContact from "./auth-info-dev-contact";
import type { Meta, StoryObj } from "@storybook/react-vite";

import { AuthContext } from "@auth/contexts/AuthContext";

import { storybookKakaoAuthMock } from "@shared/mocks/constants/storybook-auth-mock-data";

const mockAuthValue = {
  ...storybookKakaoAuthMock,
  profile: { nickname: "테스트유저" } as never,
};

const meta: Meta<typeof AuthInfoDevContact> = {
  title: "Auth/AuthInfo/AuthInfoDevContact",
  component: AuthInfoDevContact,
  decorators: [
    (Story) => (
      <AuthContext.Provider value={mockAuthValue}>
        <div className="bdks-container bg-background-primary px-4 py-6">
          <Story />
        </div>
      </AuthContext.Provider>
    ),
  ],
  parameters: {
    viewport: {
      defaultViewport: "iphone5",
    },
  },
};

export default meta;

type Story = StoryObj<typeof AuthInfoDevContact>;

// 기본 상태 (idle)
export const Default: Story = {};

// 전송 성공 상태 - emailjs mock으로 성공 처리
export const SubmitSuccess: Story = {
  parameters: {
    mockAddonConfigs: {
      globalMockData: {
        "@emailjs/browser": {
          send: () => Promise.resolve({}),
        },
      },
    },
  },
};

// 전송 실패 상태
export const SubmitError: Story = {
  parameters: {
    mockAddonConfigs: {
      globalMockData: {
        "@emailjs/browser": {
          send: () => Promise.reject(new Error("network error")),
        },
      },
    },
  },
};

// 익명 사용자
export const AnonymousUser: Story = {
  decorators: [
    (Story) => (
      <AuthContext.Provider
        value={{
          ...mockAuthValue,
          user: { id: "익명id여", email: "", is_anonymous: true } as never,
          profile: null,
        }}
      >
        <div className="bdks-container bg-background-primary px-4 py-6">
          <Story />
        </div>
      </AuthContext.Provider>
    ),
  ],
};
