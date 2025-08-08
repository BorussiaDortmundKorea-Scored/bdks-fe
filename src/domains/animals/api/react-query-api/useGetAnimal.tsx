import { animalQueryKeys } from "./animalQueryKeys";
import { getAnimals } from "../animalApi";
import { useSuspenseQuery } from "@tanstack/react-query";
import type { IAnimal } from "../animalApi";

export function useGetAnimal(): IAnimal[] {
  const { data } = useSuspenseQuery<IAnimal[]>({
    queryKey: [animalQueryKeys.animals],
    queryFn: getAnimals,
  });

  return data;
}
