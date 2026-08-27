/**
 * 작성자: KYD
 * 기능: 리그 순위 스켈레톤
 */
const AdminStandingsSkeleton = () => {
  return (
    <div className="flex h-full w-full flex-col">
      <div className="flex w-full items-center justify-between p-4">
        <h2 className="text-yds-s1 text-primary-100">리그 순위</h2>
      </div>
      <div
        data-testid="admin-standings-skeleton"
        className="yds-card yds-card-outlined flex w-full animate-pulse flex-col gap-3 p-4"
      >
        <div className="bg-background-secondary h-5 w-1/3 rounded" />
        {[...Array(8)].map((_, index) => (
          <div key={index} className="bg-background-secondary h-4 w-full rounded" />
        ))}
      </div>
    </div>
  );
};

export default AdminStandingsSkeleton;
