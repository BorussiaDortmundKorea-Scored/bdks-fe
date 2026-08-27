/**
 * 작성자: KYD
 * 기능: TOP PLAYERS 카드 래퍼 (사이드 패널, 선수 DB와 동일한 섹션 패턴)
 */
const DashboardTopPlayersWrapper = ({ children }: { children: React.ReactNode }) => {
  return (
    <section className="text-primary-100 w-full">
      <h2 className="text-yds-s2 mb-4">TOP PLAYERS</h2>
      {children}
    </section>
  );
};

export default DashboardTopPlayersWrapper;
