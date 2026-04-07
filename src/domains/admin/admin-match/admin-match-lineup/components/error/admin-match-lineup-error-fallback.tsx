import { API_ERROR_LOGO } from "@shared/constants/supabse-storage";

const AdminMatchLineupErrorFallback = () => {
  return (
    <div
      className="bg-background-primary flex h-full w-full flex-col items-center justify-center gap-4"
      data-testid="admin-match-lineup-error-fallback"
    >
      <img src={API_ERROR_LOGO} alt="에러" className="h-16 w-16" />
      <div className="text-center">
        <h2 className="text-primary-400 mb-2 text-xl font-bold">라인업 데이터를 불러올 수 없습니다</h2>
        <p className="text-primary-100 mb-4">잠시 후 다시 시도해주세요.</p>
      </div>
    </div>
  );
};

export default AdminMatchLineupErrorFallback;
