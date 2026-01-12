import { AdminDashboardMatchStatsHandlers } from "@admin/admin-dashboard/admin-dashboard-match-stats/mocks/admin-dashboard-match-stats-handler";
import { AdminDashboardUserCountHandlers } from "@admin/admin-dashboard/admin-dashboard-user-count/mocks/admin-dashboard-user-count-handler";
import { AdminMatchLineupHandlers } from "@admin/admin-match/admin-match-lineup/mocks/admin-match-lineup-handler";
import { AdminMatchLineupSubstitutionHandlers } from "@admin/admin-match/admin-match-lineup/mocks/admin-match-lineup-substitution-handler";

import { MatchInfoHandlers } from "@matches/matches-history/matches-history-players-rating/mocks/match-info-handler";
import { MatchesHistoryPlayersRatingHandlers } from "@matches/matches-history/matches-history-players-rating/mocks/matches-history-players-rating-handler";
import { MatchesHistoryHandlers } from "@matches/matches-history/mocks/matches-history-handler";
import { matchesLastestPlayerRatingHandlers } from "@matches/matches-lastest/matches-lastest-player-rating/mocks/matches-lastest-player-rating-handler";

import { PlayersDBHandlers } from "@players/players-db/mocks/players-db-handler";
import { PlayersRatingRotatorHandlers } from "@players/players-rating-rotator/mocks/player-rating-rotator-handlers";
import { PlayerStatsHandlers } from "@players/players-stats/mocks/player-stats-handler";
import { PlayersStatsByGameHandlers } from "@players/players-stats/players-stats-by-game/mocks/players-stats-by-game-handler";

export const handlers = [
  ...AdminDashboardMatchStatsHandlers,
  ...AdminDashboardUserCountHandlers,
  ...AdminMatchLineupHandlers,
  ...AdminMatchLineupSubstitutionHandlers,
  ...MatchesHistoryHandlers,
  ...MatchesHistoryPlayersRatingHandlers,
  ...MatchInfoHandlers,
  ...matchesLastestPlayerRatingHandlers,
  ...PlayersDBHandlers,
  ...PlayersRatingRotatorHandlers,
  ...PlayerStatsHandlers,
  ...PlayersStatsByGameHandlers,
];
