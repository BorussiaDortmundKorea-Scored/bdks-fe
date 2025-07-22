import { playerQueryKeys } from "./playerQueryKeys";
import { getPlayers } from "../api/playerApi";
import { useSuspenseQuery } from "@tanstack/react-query";
import type { IPlayer } from "../api/playerApi";

export function useGetPlayerList(): IPlayer[] {
  const { data } = useSuspenseQuery<IPlayer[]>({
    queryKey: [playerQueryKeys.players],
    queryFn: getPlayers,
  });

  return data;
}
