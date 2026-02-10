import { HttpResponse, http } from "msw";

import authInfoPointCardDummy from "@auth/auth-info/auth-info-point-card/mocks/auth-info-point-card-dummy.json";

export const AuthInfoPointCardHandlers = [
  http.post("*/rest/v1/rpc/get_profile_with_points", () => {
    return HttpResponse.json(authInfoPointCardDummy);
  }),
];
