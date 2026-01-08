/**
 * 작성자: KYD
 * 기능: 사용자 관리 스켈레톤 컴포넌트
 * 프로세스 설명: 사용자 데이터 로딩 중 표시되는 스켈레톤 화면
 */
import { TBody, THead, Table, Td, Th, Tr } from "@youngduck/yd-ui/Table";

const AdminUserSkeleton = () => {
  return (
    <div className="flex h-full w-full flex-col">
      {/* 헤더 */}
      <div className="flex w-full items-center justify-between p-4">
        <div className="bg-primary-100/20 h-6 w-24 animate-pulse rounded" />
        <div className="bg-primary-100/20 h-5 w-40 animate-pulse rounded" />
      </div>

      {/* 스크롤 가능한 컨텐츠 영역 */}
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
          {Array.from({ length: 10 }).map((_, index) => (
            <Tr key={index}>
              <Td>
                <div className="bg-primary-100/20 h-4 w-24 animate-pulse rounded" />
              </Td>
              <Td>
                <div className="bg-primary-100/20 h-4 w-40 animate-pulse rounded" />
              </Td>
              <Td>
                <div className="bg-primary-100/20 h-6 w-16 animate-pulse rounded-full" />
              </Td>
              <Td>
                <div className="bg-primary-100/20 h-4 w-32 animate-pulse rounded" />
              </Td>
              <Td>
                <div className="bg-primary-100/20 h-4 w-32 animate-pulse rounded" />
              </Td>
              <Td>
                <div className="flex items-center gap-3">
                  <div className="bg-primary-100/20 h-4 w-4 animate-pulse rounded" />
                </div>
              </Td>
            </Tr>
          ))}
        </TBody>
      </Table>
    </div>
  );
};

export default AdminUserSkeleton;
