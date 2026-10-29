/**
 * 작성자: KYD
 * 기능: 선수 관리 페이지 에러 폴백
 * 프로세스 설명: 에러 발생 시 표시되는 에러 UI
 */
import { useNavigate } from "react-router-dom";

import { ArrowLeft, RefreshCw } from "lucide-react";

import { API_ERROR_LOGO } from "@shared/constants/supabse-storage";

interface AdminPlayerErrorFallbackProps {
  error: Error;
  resetErrorBoundary: () => void;
}

const AdminPlayerErrorFallback = ({ error, resetErrorBoundary }: AdminPlayerErrorFallbackProps) => {
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <div className="flex h-full w-full flex-col">
      {/* 고정된 헤더 */}
      <header className="layout-header-height bg-background-primary relative z-10 flex w-full shrink-0 items-center">
        <button onClick={handleGoBack} aria-label="뒤로가기" className="flex cursor-pointer">
          <ArrowLeft size={24} className="text-primary-400" />
        </button>
        <h1 className="text-primary-400 font-shilla-culture absolute left-1/2 -translate-x-1/2 text-2xl font-bold">
          선수 관리
        </h1>
      </header>

      {/* 스크롤 가능한 컨텐츠 영역 - 헤더 높이를 제외한 나머지 영역 */}
      <div className="scrollbar-hide flex w-full flex-1 flex-col gap-4 overflow-y-auto">
        <div className="flex flex-1 items-center justify-center">
          <div className="text-center">
            <div className="mb-4 flex justify-center">
              <img src={API_ERROR_LOGO} alt="에러" className="h-16 w-16" />
            </div>
            <h2 className="mb-2 text-2xl font-bold text-gray-900">데이터를 불러오는 중 오류가 발생했습니다</h2>
            <p className="mb-6 max-w-md text-gray-600">
              선수 정보를 불러오는 중 문제가 발생했습니다. 다시 시도해주세요.
            </p>
            <div className="flex justify-center gap-3">
              <button
                onClick={resetErrorBoundary}
                className="bg-primary-400 hover:bg-primary-500 flex items-center gap-2 rounded-lg px-4 py-2 text-white transition-colors"
              >
                <RefreshCw size={16} />
                다시 시도
              </button>
              <button
                onClick={handleGoBack}
                className="rounded-lg border border-gray-300 px-4 py-2 text-gray-700 transition-colors hover:bg-gray-50"
              >
                뒤로 가기
              </button>
            </div>
            {process.env.NODE_ENV === "development" && (
              <details className="mx-auto mt-4 max-w-md text-left">
                <summary className="cursor-pointer text-sm text-gray-500 hover:text-gray-700">
                  개발자 정보 (클릭하여 확장)
                </summary>
                <pre className="mt-2 overflow-auto rounded bg-gray-100 p-2 text-xs text-red-600">{error.message}</pre>
              </details>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPlayerErrorFallback;
