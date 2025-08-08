import { useSuspenseQuery } from "@tanstack/react-query";
import { getRotatePlayerStatAccumulated, type IRotatePlayerStatAccumulated } from "../shared-api";

export function useGetRotatePlayerStatAcc(): IRotatePlayerStatAccumulated[] {
  const { data } = useSuspenseQuery<IRotatePlayerStatAccumulated[]>({
    queryKey: ["rotate-player-stat-acc"],
    queryFn: getRotatePlayerStatAccumulated,
  });

  return data;
}
