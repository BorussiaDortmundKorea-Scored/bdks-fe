import { Table, THead, TBody, Th, Td, Tr } from "@youngduck/yd-ui/Table";

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
      <Table scrollable={true} className="md:w-full" scrollClassName="h-[760px] w-full">
        <THead>
          <Tr>
            <Th>팀명</Th>
            <Th>국가</Th>
            <Th>작업</Th>
          </Tr>
        </THead>
        <TBody>
          {Array.from({ length: 5 }).map((_, index) => (
            <Tr key={index}>
              <Td>
                <div className="w-32 h-4 bg-gray-300 rounded animate-pulse"></div>
              </Td>
              <Td>
                <div className="w-20 h-4 bg-gray-300 rounded animate-pulse"></div>
              </Td>
              <Td>
                <div className="flex gap-2">
                  <div className="w-4 h-4 bg-gray-300 rounded animate-pulse"></div>
                  <div className="w-4 h-4 bg-gray-300 rounded animate-pulse"></div>
                </div>
              </Td>
            </Tr>
          ))}
        </TBody>
      </Table>
    </div>
  );
};

export default AdminTeamSkeleton;
