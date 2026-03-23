import { HttpResponse, http } from "msw";

import MatchesLastestFormationDummy from "@matches/matches-lastest/mocks/matches-lastest-formation-dummy.json";
import MatchesLastestInformationDummy from "@matches/matches-lastest/mocks/matches-lastest-information-dummy.json";

export const MatchesLastestHandlers = [
  http.post("*/rest/v1/rpc/get_latest_match_live_formation", () => {
    return HttpResponse.json(MatchesLastestFormationDummy);
  }),
  http.post("*/rest/v1/rpc/get_latest_match_information", () => {
    return HttpResponse.json(MatchesLastestInformationDummy);
  }),
];
