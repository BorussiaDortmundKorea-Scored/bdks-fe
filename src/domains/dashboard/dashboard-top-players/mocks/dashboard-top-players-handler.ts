/**
 * 작성자: KYD
 * 기능: TOP PLAYERS(선수 기록 리더) MSW 핸들러
 */
import { HttpResponse, http } from "msw";

import DashboardTopPlayersDummy from "@dashboard/dashboard-top-players/mocks/dashboard-top-players-dummy.json";

export const DashboardTopPlayersHandlers = [
  http.post("*/rest/v1/rpc/get_dashboard_record_leaders", () => {
    return HttpResponse.json(DashboardTopPlayersDummy);
  }),
];
