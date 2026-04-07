import { API_ERROR_LOGO } from "@shared/constants/supabse-storage";

const AdminCompetitionErrorFallback = () => {
  return (
    <div className="flex h-full w-full items-center justify-center">
      <div className="flex flex-col items-center gap-3 text-center">
        <img src={API_ERROR_LOGO} alt="에러" className="h-16 w-16" />
        <h2 className="text-xl font-semibold text-primary-100">대회 목록을 불러오는데 실패했습니다</h2>
        <p className="text-primary-100/60">잠시 후 다시 시도해주세요.</p>
      </div>
    </div>
  );
};

export default AdminCompetitionErrorFallback;
