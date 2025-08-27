import { type ReactNode, Suspense } from "react";

import useImageLoader from "@shared/hooks/use-image-loader";

interface OptimizedImageWithSkeletonProps {
  src: string;
  skeleton: ReactNode;
  children: (props: { src: string }) => ReactNode;
}

const ImageWithSkeleton = ({ src, skeleton, children }: OptimizedImageWithSkeletonProps) => {
  return (
    <Suspense fallback={skeleton}>
      <ImageLoader src={src} skeleton={skeleton}>
        {children}
      </ImageLoader>
    </Suspense>
  );
};

interface ImageLoaderProps {
  src: string;
  skeleton: ReactNode;
  children: (props: { src: string }) => ReactNode;
}

const ImageLoader = ({ src, skeleton, children }: ImageLoaderProps) => {
  const { src: imageSrc, isLoading, error } = useImageLoader({ src });

  if (isLoading || error) {
    return <>{skeleton}</>;
  }

  return <>{children({ src: imageSrc! })}</>;
};

export default ImageWithSkeleton;
