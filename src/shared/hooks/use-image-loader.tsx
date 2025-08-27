import { useImage } from "react-image";

interface UseImageLoaderOptions {
  src: string;
}

interface UseImageLoaderReturn {
  src: string | undefined;
  isLoading: boolean;
  error: Error | null;
}

const useImageLoader = ({ src }: UseImageLoaderOptions): UseImageLoaderReturn => {
  const {
    src: imageSrc,
    isLoading,
    error,
  } = useImage({
    srcList: src,
  });

  return {
    src: imageSrc,
    isLoading,
    error,
  };
};

export default useImageLoader;
