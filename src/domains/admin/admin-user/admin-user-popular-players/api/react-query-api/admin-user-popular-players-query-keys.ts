/**
 * 작성자: KYD
 * 기능: 인기 최애선수 순위 React Query 키
 */
export const adminUserPopularPlayersQueryKeys = {
  all: ["adminUserPopularPlayers"] as const,
  players: () => [...adminUserPopularPlayersQueryKeys.all, "players"] as const,
};
