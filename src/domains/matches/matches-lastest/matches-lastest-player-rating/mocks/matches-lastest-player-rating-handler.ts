import { HttpResponse, http } from "msw";

import MatchesLastestPlayerRatingDummy from "@matches/matches-lastest/matches-lastest-player-rating/mocks/matches-lastest-player-rating-dummy.json";

// Mock 데이터

const mockInsertResponse = {
  id: "rating-789",
  rating: 8.5,
  minute: "전반 30'",
  user_nickname: "보돌코스코어드",
  success: true,
  message: "평점이 성공적으로 입력되었습니다.",
};

// MSW 핸들러들
export const matchesLastestPlayerRatingHandlers = [
  // 특정 경기의 특정 선수 평점 조회
  http.post("*/rest/v1/rpc/get_match_single_player_rating", () => {
    console.log("MSW: get_match_single_player_rating 호출됨");
    return HttpResponse.json(MatchesLastestPlayerRatingDummy);
  }),

  // 평점 입력
  http.post("*/rest/v1/rpc/insert_player_rating", async ({ request }) => {
    console.log("MSW: insert_player_rating 호출됨");
    const body = await request.json();
    console.log("MSW: 평점 입력 요청 데이터:", body);

    // 성공 응답 시뮬레이션
    return HttpResponse.json(mockInsertResponse);
  }),

  // 사용자의 특정 선수에 대한 모든 평점 조회
  http.post("*/rest/v1/rpc/get_user_player_ratings", () => {
    console.log("MSW: get_user_player_ratings 호출됨");
    return HttpResponse.json({
      ratings: [
        {
          id: "rating-1",
          minute: "전반 15'",
          rating: 7.0,
          comment: "좋은 플레이",
          created_at: "2024-01-15T19:15:00Z",
          updated_at: "2024-01-15T19:15:00Z",
        },
        {
          id: "rating-2",
          minute: "전반 30'",
          rating: 8.5,
          comment: null,
          created_at: "2024-01-15T19:30:00Z",
          updated_at: "2024-01-15T19:30:00Z",
        },
      ],
      total_count: 2,
    });
  }),
];
