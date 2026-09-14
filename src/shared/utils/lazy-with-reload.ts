/**
 * 작성자: KYD
 * 기능: 배포로 청크 해시가 바뀌었을 때 lazy 페이지 로드 실패를 복구하는 래퍼
 * 프로세스 설명: 새 배포가 나가면 구버전 탭이 들고 있는 청크 경로가 404 가 되어
 *              "Failed to fetch dynamically imported module" 로 화면이 깨진다.
 *              이때 한 번만 새로고침해 최신 index.html·청크를 받게 한다.
 *              무한 새로고침을 막으려고 sessionStorage 에 시도 여부를 남긴다.
 */
import { lazy } from "react";

/** React.lazy 가 받는 팩토리/모듈 타입을 그대로 따른다 (직접 정의하면 제네릭이 어긋난다) */
type LazyFactory = Parameters<typeof lazy>[0];
type LazyModule = Awaited<ReturnType<LazyFactory>>;

const RELOAD_FLAG_KEY = "bdks:chunk-reloaded";

/** 청크(동적 import) 로드 실패인지 판별 — 브라우저마다 문구가 달라 넓게 잡는다 */
const isChunkLoadError = (error: unknown): boolean => {
  const message = error instanceof Error ? error.message : String(error);
  return (
    /Failed to fetch dynamically imported module/i.test(message) ||
    /error loading dynamically imported module/i.test(message) ||
    /Importing a module script failed/i.test(message) ||
    /ChunkLoadError/i.test(message)
  );
};

/** sessionStorage 는 시크릿 모드·차단 설정에서 접근 자체가 throw 할 수 있다 */
const safeSessionStorage = {
  get(key: string): string | null {
    try {
      return window.sessionStorage.getItem(key);
    } catch {
      return null;
    }
  },
  set(key: string, value: string): void {
    try {
      window.sessionStorage.setItem(key, value);
    } catch {
      /* 저장 못 해도 동작에 지장 없음 (재시도 1회 보장만 약해짐) */
    }
  },
  remove(key: string): void {
    try {
      window.sessionStorage.removeItem(key);
    } catch {
      /* noop */
    }
  },
};

/** 페이지 진입에 성공하면 다음 배포를 위해 재시도 기회를 되돌려 놓는다 */
const clearReloadFlag = (): void => safeSessionStorage.remove(RELOAD_FLAG_KEY);

/**
 * React.lazy 와 동일하게 쓰되, 청크 로드 실패 시 한 번 새로고침한다.
 * 새로고침 후에도 실패하면 그대로 에러를 올려 ErrorBoundary 가 받도록 둔다.
 */
export const lazyWithReload = (factory: LazyFactory) =>
  lazy(async () => {
    try {
      const module = await factory();
      clearReloadFlag();
      return module;
    } catch (error) {
      if (!isChunkLoadError(error) || safeSessionStorage.get(RELOAD_FLAG_KEY)) {
        throw error;
      }

      safeSessionStorage.set(RELOAD_FLAG_KEY, "1");
      window.location.reload();

      // 새로고침이 시작되는 동안 렌더를 멈춰 둔다 (이 Promise 는 끝나지 않는다)
      return new Promise<LazyModule>(() => {});
    }
  });
