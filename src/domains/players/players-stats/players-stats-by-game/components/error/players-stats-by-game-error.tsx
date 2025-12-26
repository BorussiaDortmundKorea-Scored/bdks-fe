/**
 * 작성자: KYD
 * 기능: 선수별 경기 통계 리스트 에러 폴백 UI
 * 프로세스 설명: 데이터 로딩 실패 시 에러 메시지 표시
 */
import type { ErrorFallbackProps } from "@shared/provider/react-query-boundary";

const PlayersStatsByGameError = ({ error, resetErrorBoundary }: ErrorFallbackProps) => {
  //SECTION HOOK호출 영역

  //!SECTION HOOK호출 영역

  //SECTION 상태값 영역

  //!SECTION 상태값 영역

  //SECTION 메서드 영역

  //!SECTION 메서드 영역

  return (
    <div
      data-testid="players-stats-by-game-error"
      className="flex flex-col items-center justify-center gap-2 rounded-lg border border-gray-700 bg-gray-800 p-8"
    >
      <p className="text-lg font-semibold text-red-500">경기 데이터를 불러올 수 없습니다</p>
      <p className="text-primary-100 text-sm">잠시 후 다시 시도해주세요</p>
      <button
        onClick={resetErrorBoundary}
        className="mt-4 rounded bg-primary-100 px-4 py-2 text-sm text-white hover:bg-primary-200"
        type="button"
      >
        다시 시도
      </button>
    </div>
  );
};

export default PlayersStatsByGameError;

