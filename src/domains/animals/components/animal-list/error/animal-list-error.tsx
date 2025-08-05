/**
 * 작성자: KYD
 * 기능:
 * 프로세스 설명: 프로세스 복잡시 노션링크 첨부권장
 */
import type { ErrorFallbackProps } from "@shared/provider/react-query-boundary";

import React from "react";

interface IAnimalListError extends ErrorFallbackProps {}

const AnimalListError: React.FC<IAnimalListError> = ({ resetErrorBoundary }: ErrorFallbackProps) => {
  //SECTION HOOK호출 영역

  //!SECTION HOOK호출 영역

  //SECTION 상태값 영역

  //!SECTION 상태값 영역

  //SECTION 메서드 영역

  //!SECTION 메서드 영역

  return (
    <div>
      에러발생
      <button onClick={resetErrorBoundary}>Retry</button>
    </div>
  );
};

export default AnimalListError;
