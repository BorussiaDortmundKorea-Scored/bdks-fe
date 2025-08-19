import { AnimalHandlers } from "@animals/mocks/animal-handlers";

import { PlayersDBHandlers } from "@players/players-db/mocks/players-db-handler";
import { PlayersRatingRotatorHandlers } from "@players/players-rating-rotator/mocks/player-rating-rotator-handlers";

import { MatchesHistoryHandlers } from "@matches/matches-history/mocks/matches-history-handler";

export const handlers = [
  ...AnimalHandlers,
  ...PlayersRatingRotatorHandlers,
  ...PlayersDBHandlers,
  ...MatchesHistoryHandlers,
];
