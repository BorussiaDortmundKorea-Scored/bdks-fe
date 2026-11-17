/**
 * 작성자: KYD
 * 기능: 선수 관리 모달 스켈레톤 (이적·은퇴·복귀 처리, 이력 조회)
 * 프로세스 설명: 모달 안에서 선수·팀·이적 목록을 불러오는 동안 보여준다.
 *              페이지용 표 스켈레톤(760px)을 모달에 넣으면 모달이 화면 밖으로 넘치므로 모달 크기에 맞춘 칸만 그린다.
 */
interface IAdminPlayerModalSkeletonProps {
  /** 그릴 줄 수 (폼 필드 수 또는 이력 줄 수) */
  rows?: number;
}

const AdminPlayerModalSkeleton = ({ rows = 4 }: IAdminPlayerModalSkeletonProps) => {
  return (
    <div className="flex flex-col gap-4" aria-busy="true" aria-label="불러오는 중">
      <div className="bg-primary-100/20 h-6 w-32 animate-pulse rounded" />
      {Array.from({ length: rows }).map((_, index) => (
        <div key={index} className="flex flex-col gap-2">
          <div className="bg-primary-100/20 h-4 w-16 animate-pulse rounded" />
          <div className="bg-primary-100/20 h-10 w-full animate-pulse rounded-lg" />
        </div>
      ))}
    </div>
  );
};

export default AdminPlayerModalSkeleton;
