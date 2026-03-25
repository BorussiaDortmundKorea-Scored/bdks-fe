import { HttpResponse, http } from "msw";

import authInfoProfileCardDummy from "@auth/auth-info/auth-info-profile-card/mocks/auth-info-profile-card-dummy.json";

export const AuthInfoProfileCardHandlers = [
  http.post("*/rest/v1/rpc/get_profile_summary", () => {
    return HttpResponse.json(authInfoProfileCardDummy);
  }),
];
