import { HttpResponse, http } from "msw";
import AnimalDummy from "./animal-dummy.json";

export const AnimalHandlers = [
  http.get("*/animal", () => {
    return HttpResponse.json(AnimalDummy);
  }),
];
