/**
 * 작성자: KYD
 * 기능: 경기 일정 위젯 스켈레톤
 */
import DashboardFixturesWrapper from "@dashboard/dashboard-fixtures/components/wrapper/dashboard-fixtures-wrapper";

const DashboardFixturesSkeleton = () => {
  return (
    <DashboardFixturesWrapper>
      {/* 경기 한 줄(로고 + 팀명 + 리그/날짜) 높이에 맞춘 블록 */}
      <ul className="flex w-full flex-col" data-testid="dashboard-fixtures-skeleton">
        {Array.from({ length: 4 }).map((_, index) => (
          <li key={index} className="flex items-center gap-3 py-2">
            <div className="h-14 w-14 shrink-0 animate-pulse rounded bg-white/5" />
            <div className="h-4 flex-1 animate-pulse rounded bg-white/5" />
          </li>
        ))}
      </ul>
    </DashboardFixturesWrapper>
  );
};

export default DashboardFixturesSkeleton;
