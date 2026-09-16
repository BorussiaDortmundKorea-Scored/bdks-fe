/**
 * 작성자: KYD
 * 기능: 인기 최애선수 순위 스켈레톤
 */
import AdminUserPopularPlayersWrapper from "@admin/admin-user/admin-user-popular-players/components/wrapper/admin-user-popular-players-wrapper";

const AdminUserPopularPlayersSkeleton = () => {
  return (
    <AdminUserPopularPlayersWrapper summary={<div className="bg-primary-100/20 h-4 w-32 animate-pulse rounded" />}>
      <ul className="flex w-full gap-3 overflow-hidden" data-testid="admin-user-popular-players-skeleton">
        {Array.from({ length: 8 }).map((_, index) => (
          <li key={index} className="w-[92px] shrink-0">
            <div className="flex w-full flex-col items-center gap-2">
              <div className="bg-primary-100/20 h-[64px] w-[64px] animate-pulse rounded" />
              <div className="bg-primary-100/20 h-4 w-16 animate-pulse rounded" />
              <div className="bg-primary-100/20 h-4 w-12 animate-pulse rounded" />
            </div>
          </li>
        ))}
      </ul>
    </AdminUserPopularPlayersWrapper>
  );
};

export default AdminUserPopularPlayersSkeleton;
