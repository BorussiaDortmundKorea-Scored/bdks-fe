import { HttpResponse, http } from "msw";

import PlayersStatsByGameDummy from "@players/players-stats/players-stats-by-game/mocks/players-stats-by-game-dummy.json";

export const PlayersStatsByGameHandlers = [
  // Supabase RPC URL 패턴을 더 정확하게 가로채기
  http.post("*/rest/v1/rpc/get_player_stats_by_game", () => {
    return HttpResponse.json(PlayersStatsByGameDummy);
  }),
];

