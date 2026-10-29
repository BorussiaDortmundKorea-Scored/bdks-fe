/**
 * 작성자: KYD
 * 기능: 포메이션 줄 배치 레이아웃 (사용자 평점 보드 · 관리자 라인업 입력 공용)
 * 프로세스 설명: line_number 오름차순(1선 공격 → 5선 GK)으로 위에서 아래로 줄을 쌓고,
 *              줄 안에서는 받은 순서대로 가로로 균등 배치한다.
 *              무엇을 그릴지(평점 카드 / 빈 자리 + 버튼 등)는 renderItem 으로 받는다.
 *              FormationBoard 에 편집 플래그를 넣으면 사용자·관리자 화면이 서로 묶이므로 배치만 떼어 냈다.
 */
import { Fragment, type ReactNode } from "react";

interface IFormationLineLayoutProps<T> {
  /** 키 = line_number */
  lines: Record<number, T[]>;
  getItemKey: (item: T) => string;
  renderItem: (item: T) => ReactNode;
}

const FormationLineLayout = <T,>({ lines, getItemKey, renderItem }: IFormationLineLayoutProps<T>) => {
  //SECTION 상태값 영역
  const lineNumbers = Object.keys(lines)
    .map(Number)
    .sort((a, b) => a - b);
  //!SECTION 상태값 영역

  return (
    <div className="flex h-auto w-full flex-1 flex-col justify-between py-4">
      {lineNumbers.map((lineNumber) => (
        <div key={lineNumber} className="flex h-auto w-full flex-nowrap items-center justify-around">
          {lines[lineNumber].map((item) => (
            <Fragment key={getItemKey(item)}>{renderItem(item)}</Fragment>
          ))}
        </div>
      ))}
    </div>
  );
};

export default FormationLineLayout;
