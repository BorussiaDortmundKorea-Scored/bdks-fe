import { GuideHandlers } from "./Guide/GuideHandlers";
import { AnimalHandlers } from "./Animal/animal-handlers";

export const handlers = [...GuideHandlers, ...AnimalHandlers];
