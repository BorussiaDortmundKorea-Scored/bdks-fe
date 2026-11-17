/**
 * 작성자: KYD
 * 기능: 선수 관리 모달 에러 폴백 (이적·은퇴·복귀 처리, 이력 조회)
 * 프로세스 설명: 모달 안 데이터 조회가 실패하면 모달 크기 안에서 안내하고 다시 시도할 수 있게 한다.
 */
import { Button } from "@youngduck/yd-ui";

import { API_ERROR_LOGO } from "@shared/constants/supabse-storage";

interface IAdminPlayerModalErrorFallbackProps {
  resetErrorBoundary: () => void;
}

const AdminPlayerModalErrorFallback = ({ resetErrorBoundary }: IAdminPlayerModalErrorFallbackProps) => {
  return (
    <div className="flex flex-col items-center gap-3 py-8 text-center">
      <img src={API_ERROR_LOGO} alt="에러" className="h-12 w-12" />
      <p className="text-yds-b1 text-primary-100">정보를 불러오지 못했습니다</p>
      <p className="text-yds-c1m text-primary-100/60">잠시 후 다시 시도해주세요.</p>
      <Button variant="outlined" color="primary" size="sm" onClick={resetErrorBoundary}>
        다시 시도
      </Button>
    </div>
  );
};

export default AdminPlayerModalErrorFallback;
