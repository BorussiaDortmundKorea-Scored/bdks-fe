/**
 * 작성자: KYD
 * 기능: 경기 관리 에러 폴백 컴포넌트
 * 프로세스 설명: 경기 데이터 로딩 실패 시 표시되는 에러 화면
 */
import { type ErrorBoundaryPropsWithFallback } from "react-error-boundary";

import { AlertTriangle } from "lucide-react";

const AdminMatchErrorFallback = ({ error, resetErrorBoundary }: ErrorBoundaryPropsWithFallback) => {
  return (
    <div className="bg-background-primary flex h-full w-full flex-col items-center justify-center gap-4">
      <AlertTriangle size={64} className="text-red-500" />
      <div className="text-center">
        <h2 className="text-primary-400 mb-2 text-xl font-bold">경기 데이터를 불러올 수 없습니다</h2>
        <p className="text-primary-100 mb-4">잠시 후 다시 시도해주세요.</p>
        <p className="text-sm text-gray-500">{error.message}</p>
      </div>
      <button
        onClick={resetErrorBoundary}
        className="bg-primary-400 hover:bg-primary-500 rounded-lg px-6 py-2 text-white transition-colors"
      >
        다시 시도
      </button>
    </div>
  );
};

export default AdminMatchErrorFallback;
