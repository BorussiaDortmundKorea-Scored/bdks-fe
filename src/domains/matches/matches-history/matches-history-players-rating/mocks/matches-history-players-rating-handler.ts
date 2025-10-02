// src/domains/matches/matches-history/matches-history-players-rating/mocks/matches-history-players-rating-handler.ts
import { HttpResponse, http } from "msw";

import MatchesHistoryPlayersRatingDummy from "@matches/matches-history/matches-history-players-rating/mocks/matches-history-players-rating-dummy.json";

export const MatchesHistoryPlayersRatingHandlers = [
  http.post("*/rest/v1/rpc/get_matches_player_ratings", ({ request }) => {
    console.log("MSW: RPC 요청 가로챔! get_matches_player_ratings", request.url);
    return HttpResponse.json(MatchesHistoryPlayersRatingDummy);
  }),
];
