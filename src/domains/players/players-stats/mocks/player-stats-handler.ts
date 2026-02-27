import { HttpResponse, http } from "msw";

import PlayerStatsDummy from "@players/players-stats/mocks/player-stats-dummy.json";

export const PlayerStatsHandlers = [
  // Supabase RPC URL 패턴을 더 정확하게 가로채기
  http.post("*/rest/v1/rpc/get_player_information", () => {
    return HttpResponse.json(PlayerStatsDummy);
  }),
];

