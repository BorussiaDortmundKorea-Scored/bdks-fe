/**
 * 작성자: KYD
 * 기능: 경기 일정 섹션 래퍼 (사이드 패널, 선수 DB/최근 경기와 동일한 섹션 패턴)
 */
const DashboardFixturesWrapper = ({ children }: { children: React.ReactNode }) => {
  return (
    <section className="text-primary-100 w-full">
      <h2 className="text-yds-s2 mb-4">경기 일정</h2>
      {children}
    </section>
  );
};

export default DashboardFixturesWrapper;
