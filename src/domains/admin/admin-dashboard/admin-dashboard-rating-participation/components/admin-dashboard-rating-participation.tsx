/**
 * 작성자: KYD
 * 기능: 전체 회원 대비 평점 입력 참여율 카드
 * 프로세스 설명: get_rating_participation_rate RPC로 전체/참여 유저 수와 참여율(%)을 표시
 */
import { useGetRatingParticipationSuspense } from "../api/react-query-api/use-get-rating-participation";
import AdminDashboardRatingParticipationWrapper from "./wrapper/admin-dashboard-rating-participation-wrapper";

const AdminDashboardRatingParticipation = () => {
  //SECTION HOOK호출 영역
  const { data: ratingParticipation } = useGetRatingParticipationSuspense();
  //!SECTION HOOK호출 영역

  return (
    <AdminDashboardRatingParticipationWrapper>
      <h2>평점 참여율</h2>
      <div className="flex w-full items-center justify-between text-white">
        <p className="text-yds-b1">{ratingParticipation.participation_rate}%</p>
        <p className="text-yds-c1m flex items-center gap-1">
          <span>참여 / 전체</span>
          <span className="text-yds-b2 text-primary-400">
            {ratingParticipation.rated_users} / {ratingParticipation.total_users}명
          </span>
        </p>
      </div>
    </AdminDashboardRatingParticipationWrapper>
  );
};

export default AdminDashboardRatingParticipation;
