/**
 * 작성자: KYD
 * 기능: 선수 관리 페이지 에러 폴백
 * 프로세스 설명: 선수 목록 조회 실패 시 관리자 화면 공통 모양(팀·이적 관리와 동일)으로 안내하고 다시 시도할 수 있게 한다
 */
import { Button } from "@youngduck/yd-ui";

import { API_ERROR_LOGO } from "@shared/constants/supabse-storage";

interface IAdminPlayerErrorFallbackProps {
  error: Error;
  resetErrorBoundary: () => void;
}

const AdminPlayerErrorFallback = ({ error, resetErrorBoundary }: IAdminPlayerErrorFallbackProps) => {
  return (
    <div className="flex h-full w-full items-center justify-center">
      <div className="flex flex-col items-center gap-3 text-center">
        <img src={API_ERROR_LOGO} alt="에러" className="h-16 w-16" />
        <h2 className="text-primary-100 text-xl font-semibold">선수 목록을 불러오는데 실패했습니다</h2>
        <p className="text-primary-100/60">잠시 후 다시 시도해주세요.</p>
        <Button variant="outlined" color="primary" size="sm" onClick={resetErrorBoundary}>
          다시 시도
        </Button>
        {import.meta.env.DEV && (
          <details className="mt-2 max-w-md text-left">
            <summary className="text-yds-c1m text-primary-100/60 cursor-pointer">개발자 정보 (클릭하여 확장)</summary>
            <pre className="bg-primary-100/10 text-yds-c1r mt-2 overflow-auto rounded p-2 text-red-400">
              {error.message}
            </pre>
          </details>
        )}
      </div>
    </div>
  );
};

export default AdminPlayerErrorFallback;
