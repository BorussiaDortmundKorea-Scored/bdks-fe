/**
 * 작성자: KYD
 * 기능: 최근 경기 섹션 래퍼 컴포넌트 (섹션 타이틀/레이아웃 담당)
 * 프로세스 설명: 프로세스 복잡시 노션링크 첨부권장
 */

const MatchesHistoryWrapper = ({ children }: { children: React.ReactNode }) => {
  //SECTION HOOK호출 영역

  //!SECTION HOOOK호출 영역

  //SECTION 상태값 영역

  //!SECTION 상태값 영역

  //SECTION 메서드 영역

  //!SECTION 메서드 영역

  return (
    <section className="text-primary-100 w-full">
      <h2 className="mb-4 text-[22px] font-bold">최근 경기</h2>
      {children}
    </section>
  );
};

export default MatchesHistoryWrapper;
