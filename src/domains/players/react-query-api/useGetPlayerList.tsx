import { playerQueryKeys } from "./playerQueryKeys";
import { getPlayerList } from "../api/playerApi";
import { useSuspenseQuery } from "@tanstack/react-query";
import type { IPlayer } from "../api/playerApi";

export function useGetPlayerList(): IPlayer[] {
  const { data } = useSuspenseQuery<IPlayer[]>({
    queryKey: [playerQueryKeys.players],
    queryFn: getPlayerList,
  });

  return data;
}
