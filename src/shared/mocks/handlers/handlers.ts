import { AnimalHandlers } from "@animals/mocks/animal-handlers";

import { PlayersDBHandlers } from "@players/players-db/mocks/players-db-handler";
import { PlayersRatingRotatorHandlers } from "@players/players-rating-rotator/mocks/player-rating-rotator-handlers";

export const handlers = [...AnimalHandlers, ...PlayersRatingRotatorHandlers, ...PlayersDBHandlers];
