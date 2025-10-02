/**
 * 작성자: KYD
 * 기능: 사용자 관리 스켈레톤 컴포넌트
 */
const AdminUserSkeleton = () => {
  const skeletonRows = Array.from({ length: 10 }, (_, index) => index);

  return (
    <div className="flex h-full w-full flex-col">
      {/* 헤더 스켈레톤 */}
      <div className="flex w-full items-center justify-between p-4">
        <div className="h-6 w-32 animate-pulse rounded bg-gray-600"></div>
        <div className="h-5 w-40 animate-pulse rounded bg-gray-600"></div>
      </div>

      {/* 테이블 스켈레톤 */}
      <div className="scrollbar-hide border-primary-100 flex w-full flex-1 flex-col gap-4 overflow-y-auto rounded-lg border-2">
        <table className="w-full">
          <thead className="bg-background-primary text-primary-400 border-primary-100 text-yds-b1 border-b-2">
            <tr className="h-12">
              <th className="px-6 text-left uppercase">닉네임</th>
              <th className="px-6 text-left uppercase">이메일</th>
              <th className="px-6 text-left uppercase">권한</th>
              <th className="px-6 text-left uppercase">가입일</th>
              <th className="px-6 text-left uppercase">최근 로그인</th>
              <th className="px-6 text-left uppercase">작업</th>
            </tr>
          </thead>
          <tbody className="bg-background-primary">
            {skeletonRows.map((index) => (
              <tr key={index} className="h-12">
                <td className="px-6 py-4">
                  <div className="h-4 w-24 animate-pulse rounded bg-gray-600"></div>
                </td>
                <td className="px-6 py-4">
                  <div className="h-4 w-40 animate-pulse rounded bg-gray-600"></div>
                </td>
                <td className="px-6 py-4">
                  <div className="h-6 w-16 animate-pulse rounded-full bg-gray-600"></div>
                </td>
                <td className="px-6 py-4">
                  <div className="h-4 w-32 animate-pulse rounded bg-gray-600"></div>
                </td>
                <td className="px-6 py-4">
                  <div className="h-4 w-32 animate-pulse rounded bg-gray-600"></div>
                </td>
                <td className="px-6 py-4">
                  <div className="h-4 w-4 animate-pulse rounded bg-gray-600"></div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminUserSkeleton;
