/**
 * 작성자: KYD
 * 기능: 2:3 비율의 옐로우 월 이미지 표시 (최신경기 · 경기 평점 공용)
 * 프로세스 설명: 스페이서 · 배경 이미지 · 내용을 grid 한 칸에 겹쳐 쌓는다.
 *              행 높이가 셋 중 가장 큰 값이 되므로 2:3(스페이서)이 최소 높이가 되고,
 *              내용이 그보다 크면 셸이 따라 늘어난다.
 *
 *              aspect-2/3 로 높이를 고정하면 좁은 화면에서 마지막 라인(골키퍼)이 잘린다.
 *              카드에 이름·교체 분을 붙이면서 한 행이 52px → 72~100px 로 커진 탓이다.
 *              두 화면의 래퍼가 완전히 같은 코드였어서 여기로 옮겼다.
 */
import ImageWithSkeleton from "@shared/components/image/image-with-skeleton";
import { SUPABASE_STORAGE_URL } from "@shared/constants/supabse-storage";

//SECTION 리렌더링이 불필요한영역: 매직넘버, 문자열, 상수
const YELLOW_WALL_IMAGE = `${SUPABASE_STORAGE_URL}/dortmund/yellow_wall.webp`;
/** 세 겹을 같은 grid 칸에 포갠다 */
const STACK_CELL_CLASS = "col-start-1 row-start-1";
//!SECTION 리렌더링이 불필요한영역: 매직넘버, 문자열, 상수

const FormationShell = ({ children }: { children: React.ReactNode }) => {
  return (
    <section className="relative grid w-full" aria-label="포메이션">
      {/* 최소 높이 = 너비 × 1.5 (2:3). 내용이 더 크면 아래 레이어가 셸을 늘린다 */}
      <div className={`${STACK_CELL_CLASS} pt-[150%]`} aria-hidden="true" />

      <div className={`${STACK_CELL_CLASS} overflow-hidden`}>
        <ImageWithSkeleton src={YELLOW_WALL_IMAGE} skeleton={<SkeletonComponent />}>
          {({ src }) => <img src={src} alt="yellow wall" className="h-full w-full object-cover" />}
        </ImageWithSkeleton>
      </div>

      <div className={`${STACK_CELL_CLASS} flex items-center justify-center p-2`}>{children}</div>
    </section>
  );
};

const SkeletonComponent = () => {
  return <div className="h-full w-full"></div>;
};

export default FormationShell;
