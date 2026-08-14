import TransferMarketErrorFallback from "./error/transfer-market-error-fallback";
import TransferMarketSkeleton from "./skeleton/transfer-market-skeleton";
import TransferMarket from "./transfer-market";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HttpResponse, http } from "msw";

import { AuthContext } from "@auth/contexts/AuthContext";

import { storybookKakaoAuthMock } from "@shared/mocks/constants/storybook-auth-mock-data";
import ReactQueryBoundary from "@shared/provider/react-query-boundary";

const meta: Meta<typeof TransferMarket> = {
  title: "Auth/AuthInfo/TransferMarket",
  component: TransferMarket,
  decorators: [
    (Story) => {
      const queryClient = new QueryClient({
        defaultOptions: {
          queries: {
            retry: false,
            gcTime: 0,
            staleTime: 0,
            refetchOnMount: false,
            refetchOnWindowFocus: false,
            refetchOnReconnect: false,
          },
        },
      });

      return (
        <AuthContext.Provider value={storybookKakaoAuthMock}>
          <QueryClientProvider client={queryClient}>
            <ReactQueryBoundary skeleton={<TransferMarketSkeleton />} errorFallback={TransferMarketErrorFallback}>
              <div className="bdks-container bg-background-primary px-4 py-6">
                <Story />
              </div>
            </ReactQueryBoundary>
          </QueryClientProvider>
        </AuthContext.Provider>
      );
    },
  ],
};

export default meta;

type Story = StoryObj<typeof TransferMarket>;

// 기본 - 영입/방출/임대가 섞인 이적 리스트 (전역 핸들러 더미 사용)
export const Default: Story = {
  parameters: {
    viewport: {
      defaultViewport: "iphone5",
    },
  },
};

// 에러 상태
export const Error: Story = {
  parameters: {
    msw: {
      handlers: [
        http.post("*/rest/v1/rpc/get_transfers", () => {
          return new HttpResponse(null, { status: 500 });
        }),
      ],
    },
    viewport: {
      defaultViewport: "iphone5",
    },
  },
};

// 로딩 스켈레톤
export const Loading: Story = {
  render: () => <TransferMarketSkeleton />,
  parameters: {
    viewport: {
      defaultViewport: "iphone5",
    },
  },
};
