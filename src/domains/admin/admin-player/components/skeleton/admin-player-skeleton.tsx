/**
 * 작성자: KYD
 * 기능: 선수 관리 페이지 스켈레톤
 * 프로세스 설명: 로딩 중일 때 표시되는 스켈레톤 UI
 */

const AdminPlayerSkeleton = () => {
  return (
    <div className="w-full flex flex-col h-full">
      {/* 고정된 헤더 */}
      <header className="w-full flex layout-header-height items-center relative shrink-0 bg-background-primary z-10">
        <div className="w-6 h-6 bg-gray-300 rounded animate-pulse" />
        <div className="absolute left-1/2 -translate-x-1/2 w-32 h-8 bg-gray-300 rounded animate-pulse" />
        <div className="absolute right-4 w-32 h-10 bg-gray-300 rounded animate-pulse" />
      </header>

      {/* 스크롤 가능한 컨텐츠 영역 - 헤더 높이를 제외한 나머지 영역 */}
      <div className="w-full flex-1 flex flex-col gap-4 overflow-y-auto scrollbar-hide">
        <table className="w-full">
          <thead className="bg-background-primary text-primary-400 border-b border-background-secondary">
            <tr>
              <th className="px-6 py-3 text-left text-md font-bold uppercase tracking-wider">이름</th>
              <th className="px-6 py-3 text-left text-md font-bold uppercase tracking-wider">한국어 이름</th>
              <th className="px-6 py-3 text-left text-md font-bold uppercase tracking-wider">등번호</th>
              <th className="px-6 py-3 text-left text-md font-bold uppercase tracking-wider">국적</th>
              <th className="px-6 py-3 text-left text-md font-bold uppercase tracking-wider">작업</th>
            </tr>
          </thead>
          <tbody className="bg-background-primary divide-y divide-background-secondary">
            {Array.from({ length: 5 }).map((_, index) => (
              <tr key={index} className="hover:bg-background-secondary">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="w-24 h-4 bg-gray-300 rounded animate-pulse" />
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="w-20 h-4 bg-gray-300 rounded animate-pulse" />
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="w-8 h-4 bg-gray-300 rounded animate-pulse" />
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="w-16 h-4 bg-gray-300 rounded animate-pulse" />
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex gap-2">
                    <div className="w-4 h-4 bg-gray-300 rounded animate-pulse" />
                    <div className="w-4 h-4 bg-gray-300 rounded animate-pulse" />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminPlayerSkeleton;
