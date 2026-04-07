import { API_ERROR_LOGO } from "@shared/constants/supabse-storage";

const AdminUserErrorFallback = () => {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-4">
      <img src={API_ERROR_LOGO} alt="에러" className="h-16 w-16" />
      <div className="text-yds-s1 text-primary-100">사용자 목록을 불러오는 중 오류가 발생했습니다</div>
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
