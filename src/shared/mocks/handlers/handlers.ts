import { AnimalHandlers } from "@animals/mocks/animal-handlers";
import { PlayerRatingRotatorHandlers } from "@players/players-rating-rotator/mocks/player-rating-rotator-handlers";

export const handlers = [...AnimalHandlers, ...PlayerRatingRotatorHandlers];
