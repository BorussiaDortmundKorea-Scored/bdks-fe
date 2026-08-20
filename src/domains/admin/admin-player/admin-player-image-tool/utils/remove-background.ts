/**
 * 작성자: KYD
 * 기능: 브라우저에서 이미지 배경을 제거해 투명 PNG Blob 을 반환하는 유틸
 * 프로세스 설명:
 *  - @imgly/background-removal(WASM) 을 동적 import 하여 필요할 때만 로드(메인 번들 비대화 방지)
 *  - 모델/WASM 에셋은 라이브러리 기본 CDN 에서 최초 1회 다운로드된다.
 */

export type RemoveBackgroundProgress = (key: string, current: number, total: number) => void;

export const removePlayerImageBackground = async (
  file: Blob,
  onProgress?: RemoveBackgroundProgress,
): Promise<Blob> => {
  const { removeBackground } = await import("@imgly/background-removal");

  return removeBackground(file, {
    output: { format: "image/png" },
    progress: onProgress,
  });
};
