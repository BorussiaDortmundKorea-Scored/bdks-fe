/**
 * 작성자: KYD
 * 기능: 경기 관리 스켈레톤 컴포넌트
 * 프로세스 설명: 경기 데이터 로딩 중 표시되는 스켈레톤 화면
 */
import { ArrowLeft, FolderPlus } from "lucide-react";

import { Table, THead, TBody, Th, Td, Tr } from "@youngduck/yd-ui/Table";

const AdminMatchSkeleton = () => {
  return (
    <div className="flex h-full w-full flex-col">
      {/* 고정된 헤더 */}
      <header className="layout-header-height bg-background-primary relative z-10 flex w-full shrink-0 items-center">
        <ArrowLeft size={24} className="text-primary-400 cursor-pointer" aria-label="뒤로가기" />
        <h1 className="text-primary-400 font-shilla-culture absolute left-1/2 -translate-x-1/2 text-2xl font-bold">
          경기 관리
        </h1>
        <button
          disabled
          className="border-primary-400 text-primary-400 absolute right-4 flex cursor-pointer items-center gap-2 rounded-lg border px-4 py-2 opacity-50"
          aria-label="새 경기 추가"
        >
          <FolderPlus size={20} />
          경기 추가
        </button>
      </header>

      {/* 스크롤 가능한 컨텐츠 영역 - 헤더 높이를 제외한 나머지 영역 */}
      <Table scrollable={true} className="md:w-full" scrollClassName="h-[760px] w-full">
        <THead>
          <Tr>
            <Th>경기일</Th>
            <Th>대회</Th>
            <Th>상대팀</Th>
            <Th>홈/어웨이</Th>
            <Th>스코어</Th>
            <Th>라운드</Th>
            <Th>작업</Th>
          </Tr>
        </THead>
        <TBody>
          {Array.from({ length: 5 }).map((_, index) => (
            <Tr key={index}>
              <Td>
                <div className="h-4 animate-pulse rounded bg-gray-200"></div>
              </Td>
              <Td>
                <div className="h-4 animate-pulse rounded bg-gray-200"></div>
              </Td>
              <Td>
                <div className="h-4 animate-pulse rounded bg-gray-200"></div>
              </Td>
              <Td>
                <div className="h-4 w-16 animate-pulse rounded bg-gray-200"></div>
              </Td>
              <Td>
                <div className="h-4 w-12 animate-pulse rounded bg-gray-200"></div>
              </Td>
              <Td>
                <div className="h-4 w-20 animate-pulse rounded bg-gray-200"></div>
              </Td>
              <Td>
                <div className="flex gap-2">
                  <div className="h-4 w-4 animate-pulse rounded bg-gray-200"></div>
                  <div className="h-4 w-4 animate-pulse rounded bg-gray-200"></div>
                  <div className="h-4 w-4 animate-pulse rounded bg-gray-200"></div>
                </div>
              </Td>
            </Tr>
          ))}
        </TBody>
      </Table>
    </div>
  );
};

export default AdminMatchSkeleton;
