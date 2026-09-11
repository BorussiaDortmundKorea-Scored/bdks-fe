import DashboardFixtures from "./dashboard-fixtures";
import DashboardFixturesErrorFallback from "./error/dashboard-fixtures-error-fallback";
import DashboardFixturesSkeleton from "./skeleton/dashboard-fixtures-skeleton";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HttpResponse, http } from "msw";

import ReactQueryBoundary from "@shared/provider/react-query-boundary";

/**
 * 대시보드 사이드 패널의 "경기 일정" 위젯.
 * 예정 경기를 상대팀 로고·이름 + 홈/원정·날짜 한 줄로 나열한다.
 * 기본 목 데이터는 preview 의 공용 handlers(DashboardFixturesHandlers)에서 온다.
 */
const meta: Meta<typeof DashboardFixtures> = {
  title: "Dashboard/DashboardFixtures",
  component: DashboardFixtures,
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
        <QueryClientProvider client={queryClient}>
          <ReactQueryBoundary skeleton={<DashboardFixturesSkeleton />} errorFallback={DashboardFixturesErrorFallback}>
            {/* 실제 배치인 사이드 패널 폭을 흉내 */}
            <div className="bg-background-primary w-full max-w-[360px] px-4 py-6">
              <Story />
            </div>
          </ReactQueryBoundary>
        </QueryClientProvider>
      );
    },
  ],
};

export default meta;

type Story = StoryObj<typeof DashboardFixtures>;

export const Default: Story = {};

/** 사이드 패널이 실제로 노출되는 넓은 화면 */
export const Ipad: Story = {
  globals: { viewport: { value: "ipad", isRotated: false } },
};

/** 상대팀 로고를 못 찾은 경우 - 팀명 앞 두 글자로 대체된다 */
export const NoTeamLogo: Story = {
  parameters: {
    msw: {
      handlers: [
        http.post("*/rest/v1/rpc/get_all_teams", () => {
          return HttpResponse.json([]);
        }),
      ],
    },
  },
};

/** 예정된 경기가 없는 경우 */
export const NoMatches: Story = {
  parameters: {
    msw: {
      handlers: [
        http.post("*/rest/v1/rpc/get_upcoming_matches", () => {
          return HttpResponse.json([]);
        }),
      ],
    },
  },
};

export const Loading: Story = {
  render: () => <DashboardFixturesSkeleton />,
};

export const Error: Story = {
  parameters: {
    msw: {
      handlers: [
        http.post("*/rest/v1/rpc/get_upcoming_matches", () => {
          return new HttpResponse(null, { status: 500 });
        }),
      ],
    },
  },
};
