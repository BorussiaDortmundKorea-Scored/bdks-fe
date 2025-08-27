/**
 * 작성자: KYD
 * 기능: 선수 관리 페이지 에러 폴백
 * 프로세스 설명: 에러 발생 시 표시되는 에러 UI
 */
import { useNavigate } from "react-router-dom";

import { AlertTriangle, ArrowLeft, RefreshCw } from "lucide-react";

interface AdminPlayerErrorFallbackProps {
  error: Error;
  resetErrorBoundary: () => void;
}

const AdminPlayerErrorFallback = ({ error, resetErrorBoundary }: AdminPlayerErrorFallbackProps) => {
  const navigate = useNavigate();

  const handleRetry = () => {
    resetErrorBoundary();
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <div className="w-full flex flex-col h-full">
      {/* 고정된 헤더 */}
      <header className="w-full flex layout-header-height items-center relative shrink-0 bg-background-primary z-10">
        <ArrowLeft size={24} className="text-primary-400 cursor-pointer" onClick={handleGoBack} aria-label="뒤로가기" />
        <h1 className="text-primary-400 font-shilla-culture absolute left-1/2 -translate-x-1/2 text-2xl font-bold">
          선수 관리
        </h1>
      </header>

      {/* 스크롤 가능한 컨텐츠 영역 - 헤더 높이를 제외한 나머지 영역 */}
      <div className="w-full flex-1 flex flex-col gap-4 overflow-y-auto scrollbar-hide">
        <div className="flex items-center justify-center flex-1">
          <div className="text-center">
            <div className="flex justify-center mb-4">
              <AlertTriangle size={64} className="text-red-500" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">데이터를 불러오는 중 오류가 발생했습니다</h2>
            <p className="text-gray-600 mb-6 max-w-md">
              선수 정보를 불러오는 중 문제가 발생했습니다. 다시 시도해주세요.
            </p>
            <div className="flex gap-3 justify-center">
              <button
                onClick={handleRetry}
                className="flex items-center gap-2 px-4 py-2 bg-primary-400 text-white rounded-lg hover:bg-primary-500 transition-colors"
              >
                <RefreshCw size={16} />
                다시 시도
              </button>
              <button
                onClick={handleGoBack}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                뒤로 가기
              </button>
            </div>
            {process.env.NODE_ENV === "development" && (
              <details className="mt-4 text-left max-w-md mx-auto">
                <summary className="cursor-pointer text-sm text-gray-500 hover:text-gray-700">
                  개발자 정보 (클릭하여 확장)
                </summary>
                <pre className="mt-2 p-2 bg-gray-100 rounded text-xs text-red-600 overflow-auto">{error.message}</pre>
              </details>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPlayerErrorFallback;
