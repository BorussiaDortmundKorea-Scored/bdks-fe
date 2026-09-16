/**
 * 작성자: KYD
 * 기능: 인기 최애선수 순위 MSW 핸들러
 */
import { HttpResponse, http } from "msw";

import AdminUserPopularPlayersDummy from "@admin/admin-user/admin-user-popular-players/mocks/admin-user-popular-players-dummy.json";

export const AdminUserPopularPlayersHandlers = [
  http.post("*/rest/v1/rpc/get_popular_favorite_players", () => {
    return HttpResponse.json(AdminUserPopularPlayersDummy);
  }),
];
