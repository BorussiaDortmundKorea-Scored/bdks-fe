/**
 * 작성자: KYD
 * 기능: 라인업 관리 스켈레톤 컴포넌트
 * 프로세스 설명: 라인업 데이터 로딩 중 표시되는 스켈레톤 화면
 */
import { ArrowLeft, FolderPlus } from "lucide-react";

const AdminMatchLineupSkeleton = () => {
  return (
    <div className="flex h-full w-full flex-col">
      {/* 고정된 헤더 */}
      <header className="layout-header-height bg-background-primary relative z-10 flex w-full shrink-0 items-center">
        <ArrowLeft size={24} className="text-primary-400 cursor-pointer" aria-label="뒤로가기" />
        <h1 className="text-primary-400 font-shilla-culture absolute left-1/2 -translate-x-1/2 text-2xl font-bold">
          라인업 관리
        </h1>
        <button
          disabled
          className="border-primary-400 text-primary-400 absolute right-4 flex cursor-pointer items-center gap-2 rounded-lg border px-4 py-2 opacity-50"
          aria-label="새 라인업 추가"
        >
          <FolderPlus size={20} />
          선수 추가
        </button>
      </header>

      {/* 스크롤 가능한 컨텐츠 영역 - 헤더 높이를 제외한 나머지 영역 */}
      <div className="scrollbar-hide flex w-full flex-1 flex-col gap-4 overflow-y-auto">
        <table className="w-full">
          <thead className="bg-background-primary text-primary-400 border-background-secondary border-b">
            <tr>
              <th className="text-md px-6 py-3 text-left font-bold tracking-wider uppercase">선수명</th>
              <th className="text-md px-6 py-3 text-left font-bold tracking-wider uppercase">포지션</th>
              <th className="text-md px-6 py-3 text-left font-bold tracking-wider uppercase">라인업</th>
              <th className="text-md px-6 py-3 text-left font-bold tracking-wider uppercase">주장</th>
              <th className="text-md px-6 py-3 text-left font-bold tracking-wider uppercase">교체</th>
              <th className="text-md px-6 py-3 text-left font-bold tracking-wider uppercase">골/어시</th>
              <th className="text-md px-6 py-3 text-left font-bold tracking-wider uppercase">카드</th>
              <th className="text-md px-6 py-3 text-left font-bold tracking-wider uppercase">작업</th>
            </tr>
          </thead>
          <tbody className="bg-background-primary divide-background-secondary divide-y">
            {Array.from({ length: 11 }).map((_, index) => (
              <tr key={index} className="hover:bg-background-secondary">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="h-4 animate-pulse rounded bg-gray-200"></div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="h-4 w-16 animate-pulse rounded bg-gray-200"></div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="h-4 w-12 animate-pulse rounded bg-gray-200"></div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="h-4 w-4 animate-pulse rounded bg-gray-200"></div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="h-4 w-20 animate-pulse rounded bg-gray-200"></div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="h-4 w-16 animate-pulse rounded bg-gray-200"></div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="h-4 w-12 animate-pulse rounded bg-gray-200"></div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex gap-2">
                    <div className="h-4 w-4 animate-pulse rounded bg-gray-200"></div>
                    <div className="h-4 w-4 animate-pulse rounded bg-gray-200"></div>
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

export default AdminMatchLineupSkeleton;
