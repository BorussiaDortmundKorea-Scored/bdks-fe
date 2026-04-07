import { HttpResponse, http } from "msw";

import UserRatingRankingDummy from "@auth/auth-info/auth-info-quick-links/user-ranking/mocks/user-rating-ranking-dummy.json";
import UserViewingRankingDummy from "@auth/auth-info/auth-info-quick-links/user-ranking/mocks/user-viewing-ranking-dummy.json";

export const UserRankingHandlers = [
  http.post("*/rest/v1/rpc/get_user_rating_ranking", () => {
    return HttpResponse.json(UserRatingRankingDummy);
  }),
  http.post("*/rest/v1/rpc/get_user_viewing_ranking", () => {
    return HttpResponse.json(UserViewingRankingDummy);
  }),
];
