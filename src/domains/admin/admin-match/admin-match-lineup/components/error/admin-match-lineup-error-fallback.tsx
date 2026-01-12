/**
 * 작성자: KYD
 * 기능: 라인업 관리 에러 폴백 컴포넌트
 * 프로세스 설명: 라인업 데이터 로딩 실패 시 표시되는 에러 화면
 */
import { AlertTriangle } from "lucide-react";

const AdminMatchLineupErrorFallback = () => {
  return (
    <div
      className="bg-background-primary flex h-full w-full flex-col items-center justify-center gap-4"
      data-testid="admin-match-lineup-error-fallback"
    >
      <AlertTriangle size={64} className="text-red-500" />
      <div className="text-center">
        <h2 className="text-primary-400 mb-2 text-xl font-bold">라인업 데이터를 불러올 수 없습니다</h2>
        <p className="text-primary-100 mb-4">잠시 후 다시 시도해주세요.</p>
      </div>
    </div>
  );
};

export default AdminMatchLineupErrorFallback;
