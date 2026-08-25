/**
 * 작성자: KYD
 * 기능: 경기별 평점 통계 차트 래퍼 컴포넌트
 */
import { Card } from "@youngduck/yd-ui/Cards";

const AdminDashboardMatchStatsWrapper = ({ children }: { children: React.ReactNode }) => {
  return (
    <Card
      variant="outlined"
      className="text-primary-100 flex h-full w-full flex-col justify-center md:col-start-1 md:col-end-7 md:row-start-4 md:row-end-7"
    >
      {children}
    </Card>
  );
};

export default AdminDashboardMatchStatsWrapper;
