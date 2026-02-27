// src/domains/animals/mocks/animal-handlers.ts
import PlayersRatingRotatorDummy from "./players-rating-rotator-dummy.json";
import { HttpResponse, http } from "msw";

export const PlayersRatingRotatorHandlers = [
  // Supabase RPC URL 패턴을 더 정확하게 가로채기
  http.post("*/rest/v1/rpc/get_player_rating_rotator_acc", () => {
    return HttpResponse.json(PlayersRatingRotatorDummy);
  }),
];
