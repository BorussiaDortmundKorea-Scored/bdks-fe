/**
 * 작성자: KYD
 * 기능: 2:3 비율의 옐로우 월 이미지 표시
 * 프로세스 설명: aspect-ratio로 정확한 비율 유지
 */
import { Suspense } from "react";
import { useImage } from "react-image";

import { SUPABASE_STORAGE_URL } from "@shared/constants/supabse-storage";

//SECTION 리렌더링이 불필요한영역: 매직넘버, 문자열, 상수
const YELLOW_WALL_IMAGE = `${SUPABASE_STORAGE_URL}/dortmund/yellow_wall.webp`;
//SECTION 리렌더링이 불필요한영역: 매직넘버, 문자열, 상수

const MatchesLastestWrapper = ({ children }: { children: React.ReactNode }) => {
  //SECTION HOOK호출 영역
  //!SECTION HOOK호출 영역

  //SECTION 상태값 영역
  //!SECTION 상태값 영역

  //SECTION 메서드 영역
  //!SECTION 메서드 영역

  return (
    <section className=" relative w-full aspect-[2/3]">
      <Suspense fallback={<SkeletonComponent />}>
        <MyImageComponent />
      </Suspense>
      <div className="absolute inset-0 flex items-center justify-center p-2">{children}</div>
    </section>
  );
};

const SkeletonComponent = () => {
  return <div className="w-full h-full"></div>;
};

const MyImageComponent = () => {
  const { src, isLoading, error } = useImage({
    srcList: YELLOW_WALL_IMAGE,
  });

  if (isLoading || error) {
    return <SkeletonComponent />;
  }

  return (
    <img src={src} alt="도르트문트 옐로우 월 - 열정적인 팬들로 가득한 경기장" className="w-full h-full object-cover" />
  );
};

export default MatchesLastestWrapper;
