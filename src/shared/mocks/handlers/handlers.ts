import { AnimalHandlers } from "@animals/mocks/animal-handlers";
import { PlayerRatingRotatorHandlers } from "@players/players-rating-rotator/mocks/player-rating-rotator-handlers";
import { PlayersDBHandlers } from "@players/players-db/mocks/players-db-handler";

export const handlers = [...AnimalHandlers, ...PlayerRatingRotatorHandlers, ...PlayersDBHandlers];
