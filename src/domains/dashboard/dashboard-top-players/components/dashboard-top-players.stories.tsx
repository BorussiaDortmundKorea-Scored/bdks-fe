import { BrowserRouter } from "react-router-dom";

import DashboardTopPlayers from "./dashboard-top-players";
import DashboardTopPlayersErrorFallback from "./error/dashboard-top-players-error-fallback";
import DashboardTopPlayersSkeleton from "./skeleton/dashboard-top-players-skeleton";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HttpResponse, http } from "msw";

import ReactQueryBoundary from "@shared/provider/react-query-boundary";

/**
 * 대시보드 사이드 패널의 "TOP PLAYERS" 위젯.
 * 4가지 기록 리더를 2x2 격자 카드로 보여준다.
 * 기본 목 데이터는 preview 의 공용 handlers 에서 온다.
 */
const meta: Meta<typeof DashboardTopPlayers> = {
  title: "Dashboard/DashboardTopPlayers",
  component: DashboardTopPlayers,
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
        <BrowserRouter>
          <QueryClientProvider client={queryClient}>
            <ReactQueryBoundary
              skeleton={<DashboardTopPlayersSkeleton />}
              errorFallback={DashboardTopPlayersErrorFallback}
            >
              {/* 실제 배치인 사이드 패널 폭을 흉내 */}
              <div className="bg-background-primary w-full max-w-[360px] px-4 py-6">
                <Story />
              </div>
            </ReactQueryBoundary>
          </QueryClientProvider>
        </BrowserRouter>
      );
    },
  ],
};

export default meta;

type Story = StoryObj<typeof DashboardTopPlayers>;

export const Default: Story = {};

/** 기록이 하나도 없어 4칸 모두 placeholder 인 경우 */
export const NoRecords: Story = {
  parameters: {
    msw: {
      handlers: [
        http.post("*/rest/v1/rpc/get_dashboard_record_leaders", () => {
          return HttpResponse.json([]);
        }),
      ],
    },
  },
};

export const Loading: Story = {
  render: () => <DashboardTopPlayersSkeleton />,
};

export const Error: Story = {
  parameters: {
    msw: {
      handlers: [
        http.post("*/rest/v1/rpc/get_dashboard_record_leaders", () => {
          return new HttpResponse(null, { status: 500 });
        }),
      ],
    },
  },
};
