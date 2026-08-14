/**
 * 작성자: KYD
 * 기능: 이적 관리 스켈레톤 컴포넌트
 */
import { TBody, THead, Table, Td, Th, Tr } from "@youngduck/yd-ui/Table";

const AdminTransferSkeleton = () => {
  return (
    <div className="flex h-full w-full flex-col">
      <div className="flex w-full items-center justify-between p-4">
        <div className="h-6 w-24 animate-pulse rounded bg-primary-100/20" />
        <div className="h-10 w-28 animate-pulse rounded bg-primary-100/20" />
      </div>

      <Table scrollable={true} className="md:w-full" scrollClassName="h-[760px] w-full md:w-[911px]">
        <THead>
          <Tr>
            <Th>선수</Th>
            <Th>방향</Th>
            <Th>유형</Th>
            <Th>시즌</Th>
            <Th>상대클럽</Th>
            <Th>이적일</Th>
            <Th>작업</Th>
          </Tr>
        </THead>
        <TBody>
          {Array.from({ length: 10 }).map((_, index) => (
            <Tr key={index}>
              {Array.from({ length: 6 }).map((__, col) => (
                <Td key={col}>
                  <div className="h-4 w-20 animate-pulse rounded bg-primary-100/20" />
                </Td>
              ))}
              <Td>
                <div className="flex items-center gap-3">
                  <div className="h-4 w-4 animate-pulse rounded bg-primary-100/20" />
                  <div className="h-4 w-4 animate-pulse rounded bg-primary-100/20" />
                </div>
              </Td>
            </Tr>
          ))}
        </TBody>
      </Table>
    </div>
  );
};

export default AdminTransferSkeleton;
