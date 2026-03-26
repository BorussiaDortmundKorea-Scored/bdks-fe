import ViewingCheckErrorFallback from "./error/viewing-check-error-fallback";
import ViewingCheckSkeleton from "./skeleton/viewing-check-skeleton";
import ViewingCheck from "./viewing-check";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HttpResponse, http } from "msw";

import { AuthContext } from "@auth/contexts/AuthContext";

import { storybookKakaoAuthMock } from "@shared/mocks/constants/storybook-auth-mock-data";
import ReactQueryBoundary from "@shared/provider/react-query-boundary";

const meta: Meta<typeof ViewingCheck> = {
  title: "Auth/AuthInfo/ViewingCheck",
  component: ViewingCheck,
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
            <ReactQueryBoundary skeleton={<ViewingCheckSkeleton />} errorFallback={ViewingCheckErrorFallback}>
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

type Story = StoryObj<typeof ViewingCheck>;

// 기본 스토리 - 다양한 상태의 경기가 섞여 있는 도감
export const Default: Story = {
  parameters: {
    viewport: {
      defaultViewport: "iphone5",
    },
  },
};

// 많은 경기가 있는 도감
export const ManyMatches: Story = {
  parameters: {
    msw: {
      handlers: [
        http.post("*/rest/v1/rpc/get_viewing_matches", () => {
          return HttpResponse.json([
            {
              id: "11111111-1111-1111-1111-111111111111",
              match_date: "2025-07-20",
              home_away: "HOME",
              round_name: "1R",
              competition_name: "분데스리가",
              season: "24-25",
              opponent_team_name: "유벤투스",
              opponent_team_logo_image_url:
                "https://abxgeyabzwzrorecsjcd.supabase.co/storage/v1/object/public/clubs/logo_juventus.png",
              is_live: false,
              status: "PAST",
              has_viewing_check: true,
            },
            {
              id: "22222222-2222-2222-2222-222222222222",
              match_date: "2025-07-25",
              home_away: "AWAY",
              round_name: "2R",
              competition_name: "분데스리가",
              season: "24-25",
              opponent_team_name: "RB 라이프치히",
              opponent_team_logo_image_url:
                "https://abxgeyabzwzrorecsjcd.supabase.co/storage/v1/object/public/clubs/logo_bochum.png",
              is_live: false,
              status: "PAST",
              has_viewing_check: true,
            },
            {
              id: "33333333-3333-3333-3333-333333333333",
              match_date: "2025-08-01",
              home_away: "HOME",
              round_name: "3R",
              competition_name: "분데스리가",
              season: "24-25",
              opponent_team_name: "바이에른 뮌헨",
              opponent_team_logo_image_url:
                "https://abxgeyabzwzrorecsjcd.supabase.co/storage/v1/object/public/clubs/logo_bayern.png",
              is_live: false,
              status: "PAST",
              has_viewing_check: false,
            },
            {
              id: "44444444-4444-4444-4444-444444444444",
              match_date: "2025-08-05",
              home_away: "AWAY",
              round_name: "4R",
              competition_name: "분데스리가",
              season: "24-25",
              opponent_team_name: "VfL 볼프스부르크",
              opponent_team_logo_image_url:
                "https://abxgeyabzwzrorecsjcd.supabase.co/storage/v1/object/public/clubs/logo_wolfsburg.png",
              is_live: false,
              status: "PAST",
              has_viewing_check: true,
            },
            {
              id: "55555555-5555-5555-5555-555555555555",
              match_date: "2025-08-10",
              home_away: "HOME",
              round_name: "5R",
              competition_name: "분데스리가",
              season: "24-25",
              opponent_team_name: "FC 쾰른",
              opponent_team_logo_image_url: null,
              is_live: false,
              status: "TODAY",
              has_viewing_check: false,
            },
            {
              id: "66666666-6666-6666-6666-666666666666",
              match_date: "2025-08-08",
              home_away: "AWAY",
              round_name: "6R",
              competition_name: "분데스리가",
              season: "24-25",
              opponent_team_name: "샬케 04",
              opponent_team_logo_image_url: null,
              is_live: false,
              status: "PAST",
              has_viewing_check: false,
            },
          ]);
        }),
      ],
    },
    viewport: {
      defaultViewport: "iphone5",
    },
  },
};

// 모든 경기 관람 완료
export const AllViewed: Story = {
  parameters: {
    msw: {
      handlers: [
        http.post("*/rest/v1/rpc/get_viewing_matches", () => {
          return HttpResponse.json([
            {
              id: "11111111-1111-1111-1111-111111111111",
              match_date: "2025-07-20",
              home_away: "HOME",
              round_name: "1R",
              competition_name: "분데스리가",
              season: "24-25",
              opponent_team_name: "유벤투스",
              opponent_team_logo_image_url:
                "https://abxgeyabzwzrorecsjcd.supabase.co/storage/v1/object/public/clubs/logo_juventus.png",
              is_live: false,
              status: "PAST",
              has_viewing_check: true,
            },
            {
              id: "22222222-2222-2222-2222-222222222222",
              match_date: "2025-07-25",
              home_away: "AWAY",
              round_name: "2R",
              competition_name: "분데스리가",
              season: "24-25",
              opponent_team_name: "RB 라이프치히",
              opponent_team_logo_image_url:
                "https://abxgeyabzwzrorecsjcd.supabase.co/storage/v1/object/public/clubs/logo_bochum.png",
              is_live: false,
              status: "PAST",
              has_viewing_check: true,
            },
            {
              id: "33333333-3333-3333-3333-333333333333",
              match_date: "2025-08-01",
              home_away: "HOME",
              round_name: "3R",
              competition_name: "분데스리가",
              season: "24-25",
              opponent_team_name: "바이에른 뮌헨",
              opponent_team_logo_image_url:
                "https://abxgeyabzwzrorecsjcd.supabase.co/storage/v1/object/public/clubs/logo_bayern.png",
              is_live: false,
              status: "PAST",
              has_viewing_check: true,
            },
          ]);
        }),
      ],
    },
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
        http.post("*/rest/v1/rpc/get_viewing_matches", () => {
          return new HttpResponse(null, { status: 500 });
        }),
      ],
    },
    viewport: {
      defaultViewport: "iphone5",
    },
  },
};

export const Loading: Story = {
  render: () => <ViewingCheckSkeleton />,
  parameters: {
    viewport: {
      defaultViewport: "iphone5",
    },
  },
};
