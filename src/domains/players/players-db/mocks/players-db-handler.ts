// src/domains/animals/mocks/animal-handlers.ts
import { HttpResponse, http } from "msw";
import PlayersDBDummy from "./players-db-dummy.json";

export const PlayersDBHandlers = [
  // Supabase RPC URL 패턴을 더 정확하게 가로채기
  http.post("*/rest/v1/rpc/get_all_players_db_with_my_ratings", ({ request }) => {
    console.log("MSW: RPC 요청 가로챔!", request.url);
    return HttpResponse.json(PlayersDBDummy);
  }),
];
