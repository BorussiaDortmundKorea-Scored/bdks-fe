/**
 * 작성자: KYD
 * 기능: 인기 최애선수 순위 - 사용자들이 등록한 최애선수를 순위별 가로 스크롤로 노출
 * 프로세스 설명: RPC get_popular_favorite_players 결과(등록자 수 내림차순)를 HorizonDragScroll로 렌더링
 */
import { HorizonDragScroll } from "@youngduck/yd-ui/HorizonDragScroll";

import { useGetPopularFavoritePlayersSuspense } from "@admin/admin-user/admin-user-popular-players/api/react-query-api/use-get-popular-favorite-players-suspense";
import AdminUserPopularPlayersWrapper from "@admin/admin-user/admin-user-popular-players/components/wrapper/admin-user-popular-players-wrapper";

import { SUPABASE_STORAGE_URL } from "@shared/constants/supabse-storage";

const DEFAULT_PLAYER_IMAGE = `${SUPABASE_STORAGE_URL}/players/head/head_brandt.png`;

const AdminUserPopularPlayers = () => {
  //SECTION HOOK호출 영역
  const { data: players } = useGetPopularFavoritePlayersSuspense();
  //!SECTION HOOK호출 영역

  //SECTION 상태값 영역
  const totalUserCount = players.reduce((sum, player) => sum + player.user_count, 0);
  //!SECTION 상태값 영역

  if (players.length === 0) {
    return (
      <AdminUserPopularPlayersWrapper>
        <div className="text-yds-c1r flex w-full items-center justify-center py-8 text-white/60">
          아직 최애선수를 등록한 사용자가 없습니다
        </div>
      </AdminUserPopularPlayersWrapper>
    );
  }

  return (
    <AdminUserPopularPlayersWrapper
      summary={
        <span className="text-yds-c1m text-primary-100">
          등록 {totalUserCount}명 / 선수 {players.length}명
        </span>
      }
    >
      <HorizonDragScroll as="ul" className="w-full gap-3" data-testid="scroll-container">
        {players.map((player) => (
          <li
            key={player.player_id}
            className="w-[92px] shrink-0"
            title={`${player.rank_no}위 ${player.player_name} · ${player.user_count}명`}
          >
            <div className="flex w-full flex-col items-center gap-2">
              <img
                src={player.head_profile_image_url ?? DEFAULT_PLAYER_IMAGE}
                alt={`${player.player_name} 얼굴`}
                loading="lazy"
                className="h-[64px] w-[64px] object-contain"
              />
              <div className="flex w-full flex-col items-center gap-[2px]">
                <span className="text-yds-c1r w-full truncate text-center text-white">{player.player_name}</span>
                <span className="text-yds-c1m text-primary-100 font-bold">
                  {player.user_count}명 ({Number(player.percentage).toFixed(1)}%)
                </span>
              </div>
            </div>
          </li>
        ))}
      </HorizonDragScroll>
    </AdminUserPopularPlayersWrapper>
  );
};

export default AdminUserPopularPlayers;
