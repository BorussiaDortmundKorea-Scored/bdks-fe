import { HttpResponse, http } from "msw";

import ViewingCheckDummy from "@auth/auth-info/auth-info-quick-links/viewing-check/mocks/viewing-check-dummy.json";

export const ViewingCheckHandlers = [
  http.post("*/rest/v1/rpc/get_viewing_matches", () => {
    return HttpResponse.json(ViewingCheckDummy);
  }),
];
