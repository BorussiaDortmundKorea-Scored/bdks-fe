const DashboardPage = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-center mb-8">축구 평점 시스템</h1>

        {/* 현재 경기 포메이션 */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">현재 경기 평점 현황</h2>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="text-center text-gray-500">포메이션 영역</div>
          </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* 최근 경기 목록 */}
          <section>
            <h2 className="text-2xl font-semibold mb-4">최근 경기</h2>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="text-center text-gray-500">최근 경기 목록</div>
            </div>
          </section>

          {/* 선수 DB 현황 */}
          <section>
            <h2 className="text-2xl font-semibold mb-4">선수 DB</h2>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="text-center text-gray-500">선수 목록</div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
