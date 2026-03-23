import { HttpResponse, http } from "msw";

export const PlayerRatingByMatchDetailHandlers = [
  http.post("*/rest/v1/rpc/get_player_rating_by_match_detail", () => {
    return HttpResponse.json({
      my_ratings: [
        { minute: "전반 15'", avg_rating: 7.0, rating_count: 1 },
        { minute: "후반 10'", avg_rating: 8.0, rating_count: 1 },
      ],
      other_ratings: [
        { minute: "전반 15'", avg_rating: 6.5, rating_count: 10 },
        { minute: "후반 10'", avg_rating: 7.2, rating_count: 8 },
      ],
    });
  }),
];
