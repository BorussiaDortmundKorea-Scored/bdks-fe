export const ADMIN_MATCH_QUERY_KEYS = {
  all: ["admin-match"] as const,
  lists: () => [...ADMIN_MATCH_QUERY_KEYS.all, "list"] as const,
  list: (filters: string) => [...ADMIN_MATCH_QUERY_KEYS.lists(), { filters }] as const,
  details: () => [...ADMIN_MATCH_QUERY_KEYS.all, "detail"] as const,
  detail: (id: string) => [...ADMIN_MATCH_QUERY_KEYS.details(), id] as const,
};
