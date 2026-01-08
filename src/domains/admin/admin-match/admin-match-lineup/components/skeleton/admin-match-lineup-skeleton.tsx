/**
 * 작성자: KYD
 * 기능: 라인업 관리 스켈레톤 컴포넌트
 * 프로세스 설명: 라인업 데이터 로딩 중 표시되는 스켈레톤 화면
 */
import { TBody, THead, Table, Td, Th, Tr } from "@youngduck/yd-ui/Table";

const AdminMatchLineupSkeleton = () => {
  return (
    <div className="flex h-full w-full flex-col">
      {/* 헤더 */}
      <div className="flex w-full items-center justify-between p-4">
        <div className="bg-primary-100/20 h-6 w-24 animate-pulse rounded" />
        <div className="bg-primary-100/20 h-10 w-28 animate-pulse rounded" />
      </div>

      {/* 스크롤 가능한 컨텐츠 영역 */}
      <Table scrollable={true} className="md:w-full" scrollClassName="h-[760px] w-full">
        <THead>
          <Tr>
            <Th>선수명</Th>
            <Th>포지션</Th>
            <Th>라인업</Th>
            <Th>주장</Th>
            <Th>교체</Th>
            <Th>골/어시</Th>
            <Th>카드</Th>
            <Th>작업</Th>
          </Tr>
        </THead>
        <TBody>
          {Array.from({ length: 11 }).map((_, index) => (
            <Tr key={index}>
              <Td>
                <div className="bg-primary-100/20 h-4 w-32 animate-pulse rounded" />
              </Td>
              <Td>
                <div className="bg-primary-100/20 h-4 w-20 animate-pulse rounded" />
              </Td>
              <Td>
                <div className="bg-primary-100/20 h-4 w-12 animate-pulse rounded" />
              </Td>
              <Td>
                <div className="bg-primary-100/20 h-4 w-4 animate-pulse rounded" />
              </Td>
              <Td>
                <div className="bg-primary-100/20 h-4 w-20 animate-pulse rounded" />
              </Td>
              <Td>
                <div className="bg-primary-100/20 h-4 w-16 animate-pulse rounded" />
              </Td>
              <Td>
                <div className="bg-primary-100/20 h-4 w-12 animate-pulse rounded" />
              </Td>
              <Td>
                <div className="flex items-center gap-3">
                  <div className="bg-primary-100/20 h-4 w-4 animate-pulse rounded" />
                  <div className="bg-primary-100/20 h-4 w-4 animate-pulse rounded" />
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

export default AdminMatchLineupSkeleton;
