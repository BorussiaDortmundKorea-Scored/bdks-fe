export const ADMIN_MATCH_LINEUP_QUERY_KEYS = {
  all: ["admin-match-lineup"] as const,
  lists: () => [...ADMIN_MATCH_LINEUP_QUERY_KEYS.all, "list"] as const,
  list: (matchId: string) => [...ADMIN_MATCH_LINEUP_QUERY_KEYS.lists(), { matchId }] as const,
  details: () => [...ADMIN_MATCH_LINEUP_QUERY_KEYS.all, "detail"] as const,
  detail: (id: number) => [...ADMIN_MATCH_LINEUP_QUERY_KEYS.details(), id] as const,
  players: () => [...ADMIN_MATCH_LINEUP_QUERY_KEYS.all, "players"] as const,
  positions: () => [...ADMIN_MATCH_LINEUP_QUERY_KEYS.all, "positions"] as const,
};
