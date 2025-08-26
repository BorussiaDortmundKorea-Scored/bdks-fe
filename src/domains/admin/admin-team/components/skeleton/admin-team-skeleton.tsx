const AdminTeamSkeleton = () => {
  return (
    <div className="w-full h-full flex flex-col">
      {/* 헤더 스켈레톤 */}
      <div className="w-full flex layout-header-height items-center relative shrink-0 bg-background-primary">
        <div className="w-6 h-6 bg-gray-300 rounded animate-pulse"></div>
        <div className="absolute left-1/2 -translate-x-1/2 w-32 h-8 bg-gray-300 rounded animate-pulse"></div>
        <div className="absolute right-4 w-24 h-10 bg-gray-300 rounded animate-pulse"></div>
      </div>

      {/* 테이블 스켈레톤 */}
      <div className="w-full flex-1 flex flex-col gap-4 overflow-y-auto">
        <table className="w-full">
          <thead className="bg-background-primary text-primary-400 border-b border-background-secondary">
            <tr>
              <th className="px-6 py-3 text-left text-md font-bold uppercase tracking-wider">팀명</th>
              <th className="px-6 py-3 text-left text-md font-bold uppercase tracking-wider">국가</th>
              <th className="px-6 py-3 text-left text-md font-bold uppercase tracking-wider">작업</th>
            </tr>
          </thead>
          <tbody className="bg-background-primary divide-y divide-background-secondary">
            {Array.from({ length: 5 }).map((_, index) => (
              <tr key={index} className="hover:bg-background-secondary">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="w-32 h-4 bg-gray-300 rounded animate-pulse"></div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="w-20 h-4 bg-gray-300 rounded animate-pulse"></div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex gap-2">
                    <div className="w-4 h-4 bg-gray-300 rounded animate-pulse"></div>
                    <div className="w-4 h-4 bg-gray-300 rounded animate-pulse"></div>
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

export default AdminTeamSkeleton;
