/**
 * 작성자: KYD
 * 기능: 선수 관리 페이지 스켈레톤
 * 프로세스 설명: 로딩 중일 때 표시되는 스켈레톤 UI
 */
import { Table, THead, TBody, Th, Td, Tr } from "@youngduck/yd-ui/Table";

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
      <Table scrollable={true} className="md:w-full" scrollClassName="h-[760px] w-full">
        <THead>
          <Tr>
            <Th>이름</Th>
            <Th>한국어 이름</Th>
            <Th>등번호</Th>
            <Th>국적</Th>
            <Th>작업</Th>
          </Tr>
        </THead>
        <TBody>
          {Array.from({ length: 5 }).map((_, index) => (
            <Tr key={index}>
              <Td>
                <div className="w-24 h-4 bg-gray-300 rounded animate-pulse" />
              </Td>
              <Td>
                <div className="w-20 h-4 bg-gray-300 rounded animate-pulse" />
              </Td>
              <Td>
                <div className="w-8 h-4 bg-gray-300 rounded animate-pulse" />
              </Td>
              <Td>
                <div className="w-16 h-4 bg-gray-300 rounded animate-pulse" />
              </Td>
              <Td>
                <div className="flex gap-2">
                  <div className="w-4 h-4 bg-gray-300 rounded animate-pulse" />
                  <div className="w-4 h-4 bg-gray-300 rounded animate-pulse" />
                </div>
              </Td>
            </Tr>
          ))}
        </TBody>
      </Table>
    </div>
  );
};

export default AdminPlayerSkeleton;
