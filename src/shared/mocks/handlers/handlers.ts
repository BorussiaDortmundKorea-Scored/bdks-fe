import { AdminDashboardMatchStatsHandlers } from "@admin/admin-dashboard/admin-dashboard-match-stats/mocks/admin-dashboard-match-stats-handler";
import { AdminDashboardUserCountHandlers } from "@admin/admin-dashboard/admin-dashboard-user-count/mocks/admin-dashboard-user-count-handler";

import { AnimalHandlers } from "@animals/mocks/animal-handlers";

import { MatchInfoHandlers } from "@matches/matches-history/matches-history-players-rating/mocks/match-info-handler";
import { MatchesHistoryPlayersRatingHandlers } from "@matches/matches-history/matches-history-players-rating/mocks/matches-history-players-rating-handler";
import { MatchesHistoryHandlers } from "@matches/matches-history/mocks/matches-history-handler";
import { matchesLastestPlayerRatingHandlers } from "@matches/matches-lastest/matches-lastest-player-rating/mocks/matches-lastest-player-rating-handler";

import { PlayersDBHandlers } from "@players/players-db/mocks/players-db-handler";
import { PlayersRatingRotatorHandlers } from "@players/players-rating-rotator/mocks/player-rating-rotator-handlers";

export const handlers = [
  ...AdminDashboardMatchStatsHandlers,
  ...AdminDashboardUserCountHandlers,
  ...AnimalHandlers,
  ...MatchesHistoryHandlers,
  ...MatchesHistoryPlayersRatingHandlers,
  ...MatchInfoHandlers,
  ...matchesLastestPlayerRatingHandlers,
  ...PlayersDBHandlers,
  ...PlayersRatingRotatorHandlers,
];
