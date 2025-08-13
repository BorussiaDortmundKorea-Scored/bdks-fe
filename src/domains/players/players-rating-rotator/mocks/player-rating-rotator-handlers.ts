// src/domains/animals/mocks/animal-handlers.ts
import { HttpResponse, http } from "msw";
import PlayerDummy from "./player-rating-rotator-dummy.json";

export const PlayerRatingRotatorHandlers = [
  // Supabase RPC URL 패턴을 더 정확하게 가로채기
  http.post("*/rest/v1/rpc/get_player_rating_rotator_acc", ({ request }) => {
    console.log("MSW: RPC 요청 가로챔!", request.url);
    return HttpResponse.json(PlayerDummy);
  }),
];
