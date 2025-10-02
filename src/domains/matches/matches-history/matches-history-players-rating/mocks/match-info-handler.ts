import { HttpResponse, http } from "msw";

import MatchInfoDummy from "@matches/matches-history/matches-history-players-rating/mocks/match-info-dummy.json";

export const MatchInfoHandlers = [
  http.post("*/rest/v1/rpc/get_match_info", () => {
    return HttpResponse.json(MatchInfoDummy);
  }),
];
