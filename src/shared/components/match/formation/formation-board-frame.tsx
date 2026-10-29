/**
 * 작성자: KYD
 * 기능: 포메이션 보드 틀 (최신경기 · 경기 평점 · 관리자 라인업 공용)
 * 프로세스 설명: 옐로우 월 셸 + 반투명 레이어 + 경기정보 헤더 + 우하단 선발/교체 토글까지만 그린다.
 *              레이어 안에 무엇을 그릴지(평점 카드 링크 / 빈 자리·클릭 카드)는 children 으로 받는다.
 *              FormationBoard 에 편집 플래그를 넣으면 사용자·관리자 화면이 서로 묶이므로 틀만 떼어 냈다.
 */
import { type ReactNode } from "react";

import FormationShell from "@shared/components/match/formation/formation-shell";
import { type FormationViewType } from "@shared/components/match/formation/formation-types";

//SECTION 리렌더링이 불필요한영역: 매직넘버, 문자열, 상수
const VIEW_TOGGLE_OPTIONS: { value: FormationViewType; label: string }[] = [
  { value: "PLAY", label: "선발" },
  { value: "NOT_PLAY", label: "교체" },
];
//!SECTION 리렌더링이 불필요한영역: 매직넘버, 문자열, 상수

interface IFormationBoardFrameProps {
  /** 헤더 좌측 1행 (예: 도르트문트(H) vs 상대) */
  title: ReactNode;
  /** 헤더 좌측 2행 (예: 시즌 리그 라운드) */
  subtitle: ReactNode;
  /** 헤더 우측 (진행 시간, 스코어, 포메이션 선택 등) */
  headerRight: ReactNode;
  viewType: FormationViewType;
  onViewTypeChange: (viewType: FormationViewType) => void;
  children: ReactNode;
}

const FormationBoardFrame = ({
  title,
  subtitle,
  headerRight,
  viewType,
  onViewTypeChange,
  children,
}: IFormationBoardFrameProps) => {
  return (
    <FormationShell>
      {/* 상단부 : 경기정보 */}
      <div className="bg-background-secondary-layer flex h-full w-full flex-col rounded-[4px] p-2">
        <div className="flex h-auto w-full items-center justify-between gap-2">
          <div className="flex flex-col gap-1">
            <div className="text-yds-b1 text-white">{title}</div>
            <div className="text-primary-100 text-yds-c1m">{subtitle}</div>
          </div>
          {headerRight}
        </div>

        {/* 하단부 : 선발 / 교체 명단 */}
        {children}
      </div>

      {/* 포메이션 뷰 타입 토글 버튼 */}
      <div className="bg-background-secondary-layer absolute right-4 bottom-4 z-10 flex overflow-hidden rounded-full shadow-lg backdrop-blur-sm">
        {VIEW_TOGGLE_OPTIONS.map((option) => (
          <button
            key={option.value}
            type="button"
            className={`text-yds-c1m px-3 py-1.5 transition-colors ${viewType === option.value ? "text-primary-400" : "text-white"}`}
            onClick={() => onViewTypeChange(option.value)}
          >
            {option.label}
          </button>
        ))}
      </div>
    </FormationShell>
  );
};

export default FormationBoardFrame;
