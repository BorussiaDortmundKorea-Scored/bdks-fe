import { AnimalHandlers } from "@animals/mocks/animal-handlers";
import { PlayerRatingRotatorHandlers } from "@players/players-rating-rotator/mocks/player-rating-rotator-handlers";
import { PlayerDBHandlers } from "@players/player-db/mocks/player-db-handler";

export const handlers = [...AnimalHandlers, ...PlayerRatingRotatorHandlers, ...PlayerDBHandlers];
