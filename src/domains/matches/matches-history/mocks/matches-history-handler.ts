// src/domains/animals/mocks/animal-handlers.ts
import { HttpResponse, http } from "msw";

import MatchesHistoryDummy from "@matches/matches-history/mocks/matches-history-dummy.json";

export const MatchesHistoryHandlers = [
  // Supabase RPC URL 패턴을 더 정확하게 가로채기
  http.post("*/rest/v1/rpc/get_all_finish_match_lists", ({ request }) => {
    console.log("MSW: RPC 요청 가로챔!", request.url);
    return HttpResponse.json(MatchesHistoryDummy);
  }),
];
