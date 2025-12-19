import { TBody, THead, Table, Td, Th, Tr } from "@youngduck/yd-ui/Table";

const AdminCompetitionSkeleton = () => {
  return (
    <div className="flex h-full w-full flex-col">
      {/* 헤더 스켈레톤 */}
      <div className="layout-header-height bg-background-primary relative flex w-full shrink-0 items-center">
        <div className="h-6 w-6 animate-pulse rounded bg-gray-300"></div>
        <div className="absolute left-1/2 h-8 w-32 -translate-x-1/2 animate-pulse rounded bg-gray-300"></div>
        <div className="absolute right-4 h-10 w-24 animate-pulse rounded bg-gray-300"></div>
      </div>

      {/* 테이블 스켈레톤 */}
      <Table scrollable={true} className="md:w-full" scrollClassName="h-[760px] w-full">
        <THead>
          <Tr>
            <Th>대회명</Th>
            <Th>시즌</Th>
            <Th>작업</Th>
          </Tr>
        </THead>
        <TBody>
          {Array.from({ length: 5 }).map((_, index) => (
            <Tr key={index}>
              <Td>
                <div className="h-4 w-32 animate-pulse rounded bg-gray-300"></div>
              </Td>
              <Td>
                <div className="h-4 w-20 animate-pulse rounded bg-gray-300"></div>
              </Td>
              <Td>
                <div className="flex gap-2">
                  <div className="h-4 w-4 animate-pulse rounded bg-gray-300"></div>
                  <div className="h-4 w-4 animate-pulse rounded bg-gray-300"></div>
                </div>
              </Td>
            </Tr>
          ))}
        </TBody>
      </Table>
    </div>
  );
};

export default AdminCompetitionSkeleton;
