/**
 * 작성자: KYD
 * 기능: 유저 랭킹 포디엄 UI
 * 프로세스 설명: 평점 입력 횟수 / 직관 횟수 기준 상위 3명을 시상대 형태로 표시
 */
import { Star } from "lucide-react";

import { useGetUserRanking } from "@auth/auth-info/auth-info-quick-links/user-ranking/api/react-query-api/use-get-user-ranking";
import { useGetUserViewingRanking } from "@auth/auth-info/auth-info-quick-links/user-ranking/api/react-query-api/use-get-user-viewing-ranking";
import { type IUserRankingBase } from "@auth/auth-info/auth-info-quick-links/user-ranking/api/user-ranking-api";
import UserRankingWrapper from "@auth/auth-info/auth-info-quick-links/user-ranking/components/wrapper/user-ranking-wrapper";

const PODIUM_CONFIG = {
  1: { height: "h-28", avatarSize: "h-20 w-20", ringColor: "ring-yellow-400", starColor: "text-yellow-400", order: 2 },
  2: { height: "h-20", avatarSize: "h-16 w-16", ringColor: "ring-gray-300", starColor: "text-gray-300", order: 1 },
  3: { height: "h-16", avatarSize: "h-14 w-14", ringColor: "ring-amber-600", starColor: "text-amber-600", order: 3 },
} as const;

interface IPodiumCardProps {
  user: IUserRankingBase;
  countLabel: string;
}

const PodiumCard = ({ user, countLabel }: IPodiumCardProps) => {
  const config = PODIUM_CONFIG[user.rank as keyof typeof PODIUM_CONFIG];

  return (
    <div className={`flex flex-col items-center gap-2 order-${config.order}`} style={{ order: config.order }}>
      {/* 별 아이콘 */}
      <Star className={`${config.starColor} fill-current`} size={user.rank === 1 ? 28 : 20} />

      {/* 최애선수 아바타 */}
      <div
        className={`${config.avatarSize} overflow-hidden rounded-full ring-2 ${config.ringColor} bg-background-tertiary`}
      >
        {user.favorite_player_image_url ? (
          <img
            src={user.favorite_player_image_url}
            alt={user.nickname}
            className="h-full w-full object-cover"
            loading="lazy"
            decoding="async"
          />
        ) : (
          <div className="bg-background-secondary text-yds-b1 text-primary-100 flex h-full w-full items-center justify-center">
            {user.nickname.charAt(0)}
          </div>
        )}
      </div>

      {/* 닉네임 */}
      <p className="text-yds-c1m line-clamp-2 w-24 text-center text-white">{user.nickname}</p>

      {/* 포디엄 기둥 */}
      <div
        className={`${config.height} flex w-24 flex-col items-center justify-start pt-2`}
        style={{
          background:
            user.rank === 1
              ? "linear-gradient(180deg, rgba(255,205,0,0.4) 0%, rgba(255,205,0,0.1) 100%)"
              : user.rank === 2
                ? "linear-gradient(180deg, rgba(192,192,192,0.3) 0%, rgba(192,192,192,0.08) 100%)"
                : "linear-gradient(180deg, rgba(205,127,50,0.3) 0%, rgba(205,127,50,0.08) 100%)",
        }}
      >
        <span className="text-yds-s1 text-white">
          {user.rank}
          <span className="text-yds-c1m">{user.rank === 1 ? "st" : user.rank === 2 ? "nd" : "rd"}</span>
        </span>
        <span className="text-yds-c1m text-primary-100">{countLabel}</span>
      </div>
    </div>
  );
};

interface IRankingSectionProps<T extends IUserRankingBase> {
  title: string;
  rankings: T[];
  getCountLabel: (user: T) => string;
}

const RankingSection = <T extends IUserRankingBase>({ title, rankings, getCountLabel }: IRankingSectionProps<T>) => {
  return (
    <>
      <h1 className="text-yds-s2 text-primary-100">{title}</h1>

      <div className="flex items-end justify-center gap-4">
        {[2, 1, 3].map((rank) => {
          const user = rankings.find((r) => r.rank === rank);
          if (!user) return <div key={rank} className="w-24" />;
          return <PodiumCard key={user.user_id} user={user} countLabel={getCountLabel(user)} />;
        })}
      </div>
    </>
  );
};

const UserRanking = () => {
  //SECTION HOOK호출 영역
  const { data: ratingRankings } = useGetUserRanking();
  const { data: viewingRankings } = useGetUserViewingRanking();
  //!SECTION HOOK호출 영역

  return (
    <UserRankingWrapper>
      <RankingSection
        title="평점 입력 횟수 TOP 3 회원"
        rankings={ratingRankings}
        getCountLabel={(user) => `${user.rating_count}회`}
      />

      <RankingSection
        title="직관 횟수 TOP 3 회원"
        rankings={viewingRankings}
        getCountLabel={(user) => `${user.viewing_count}경기`}
      />
    </UserRankingWrapper>
  );
};

export default UserRanking;
