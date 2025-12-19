/**
 * 작성자: KYD
 * 기능: 사용자 관리 스켈레톤 컴포넌트
 */
import { TBody, THead, Table, Td, Th, Tr } from "@youngduck/yd-ui/Table";

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
      <Table scrollable={true} className="md:w-full" scrollClassName="h-[760px] w-full">
        <THead>
          <Tr>
            <Th>닉네임</Th>
            <Th>이메일</Th>
            <Th>권한</Th>
            <Th>가입일</Th>
            <Th>최근 로그인</Th>
            <Th>작업</Th>
          </Tr>
        </THead>
        <TBody>
          {skeletonRows.map((index) => (
            <Tr key={index}>
              <Td>
                <div className="h-4 w-24 animate-pulse rounded bg-gray-600"></div>
              </Td>
              <Td>
                <div className="h-4 w-40 animate-pulse rounded bg-gray-600"></div>
              </Td>
              <Td>
                <div className="h-6 w-16 animate-pulse rounded-full bg-gray-600"></div>
              </Td>
              <Td>
                <div className="h-4 w-32 animate-pulse rounded bg-gray-600"></div>
              </Td>
              <Td>
                <div className="h-4 w-32 animate-pulse rounded bg-gray-600"></div>
              </Td>
              <Td>
                <div className="h-4 w-4 animate-pulse rounded bg-gray-600"></div>
              </Td>
            </Tr>
          ))}
        </TBody>
      </Table>
    </div>
  );
};

export default AdminUserSkeleton;
