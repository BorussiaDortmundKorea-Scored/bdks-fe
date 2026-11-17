/**
 * 작성자: KYD
 * 기능: 선수 관리 페이지 스켈레톤
 * 프로세스 설명: 로딩 중일 때 표시되는 스켈레톤 UI. 본체와 같은 헤더·탭·7칸 표 모양으로 그려 로딩 후 화면이 튀지 않게 한다
 */
import { Col, ColGroup, TBody, THead, Table, Td, Th, Tr } from "@youngduck/yd-ui/Table";

const AdminPlayerSkeleton = () => {
  return (
    <div className="flex h-full w-full flex-col">
      {/* 헤더 */}
      <div className="flex h-9 w-full shrink-0 items-center justify-between">
        <div className="bg-primary-100/20 h-6 w-24 animate-pulse rounded" />
        <div className="flex items-center gap-1">
          <div className="bg-primary-100/20 h-9 w-9 animate-pulse rounded-md" />
          <div className="bg-primary-100/20 h-9 w-9 animate-pulse rounded-md" />
        </div>
      </div>

      {/* 탭 */}
      <div className="mt-2 flex gap-4 py-2">
        {Array.from({ length: 3 }).map((_, index) => (
          <div key={index} className="bg-primary-100/20 h-6 w-16 animate-pulse rounded" />
        ))}
      </div>

      {/* 스크롤 가능한 컨텐츠 영역 */}
      <Table
        scrollable={true}
        className="xl:w-full"
        scrollClassName="h-[760px] w-full [scrollbar-gutter:stable] xl:h-auto xl:min-h-0 xl:flex-1"
      >
        <ColGroup>
          <Col className="w-[160px]" />
          <Col className="w-[120px]" />
          <Col className="w-[80px]" />
          <Col className="w-[120px]" />
          <Col className="w-[110px]" />
          <Col className="w-[110px]" />
          <Col className="w-[200px]" />
        </ColGroup>
        <THead>
          <Tr>
            <Th>영문 이름</Th>
            <Th>이름</Th>
            <Th>등번호</Th>
            <Th>국적</Th>
            <Th>전신 이미지</Th>
            <Th>얼굴 이미지</Th>
            <Th>작업</Th>
          </Tr>
        </THead>
        <TBody>
          {Array.from({ length: 10 }).map((_, index) => (
            <Tr key={index}>
              <Td>
                <div className="bg-primary-100/20 h-4 w-32 animate-pulse rounded" />
              </Td>
              <Td>
                <div className="bg-primary-100/20 h-4 w-20 animate-pulse rounded" />
              </Td>
              <Td>
                <div className="bg-primary-100/20 h-4 w-8 animate-pulse rounded" />
              </Td>
              <Td>
                <div className="bg-primary-100/20 h-4 w-16 animate-pulse rounded" />
              </Td>
              <Td>
                <div className="bg-primary-100/20 h-24 w-14 animate-pulse rounded" />
              </Td>
              <Td>
                <div className="bg-primary-100/20 h-16 w-16 animate-pulse rounded-md" />
              </Td>
              <Td>
                <div className="flex items-center gap-2">
                  {Array.from({ length: 5 }).map((__, col) => (
                    <div key={col} className="bg-primary-100/20 h-6 w-6 animate-pulse rounded-md" />
                  ))}
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
