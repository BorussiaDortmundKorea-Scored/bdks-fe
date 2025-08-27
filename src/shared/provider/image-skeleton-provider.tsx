/**
 * 작성자: KYD
 * 기능: react-image 라이브러리를 사용하여 이미지 로딩시 스켈레톤을 제공하는 모듈 함수
 * 프로세스 설명:
 */
import { Suspense } from "react";

interface IImageSkeletonProvider {
  children: React.ReactNode;
  skeleton: React.ReactNode;
}

const ImageSkeletonProvider: React.FC<IImageSkeletonProvider> = ({ children, skeleton }) => {
  //SECTION HOOK호출 영역

  //!SECTION HOOK호출 영역

  //SECTION 상태값 영역

  //!SECTION 상태값 영역

  //SECTION 메서드 영역

  //!SECTION 메서드 영역

  return <Suspense fallback={skeleton}>{children}</Suspense>;
};

export default ImageSkeletonProvider;
