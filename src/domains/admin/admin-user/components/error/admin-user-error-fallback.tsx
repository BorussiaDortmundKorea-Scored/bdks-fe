/**
 * 작성자: KYD
 * 기능: 사용자 관리 에러 폴백 컴포넌트
 */
const AdminUserErrorFallback = () => {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-4">
      <div className="text-yds-s1 text-red-400">사용자 목록을 불러오는 중 오류가 발생했습니다</div>
      <button
        onClick={() => window.location.reload()}
        className="text-primary-100 hover:bg-primary-100/20 rounded-md px-4 py-2 transition-colors"
      >
        새로고침
      </button>
    </div>
  );
};

export default AdminUserErrorFallback;
