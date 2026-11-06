/**
 * 작성자: KYD
 * 기능: 접근 실패에도 throw 하지 않는 sessionStorage 래퍼
 * 프로세스 설명: sessionStorage 는 시크릿 모드·차단 설정에서 접근 자체가 throw 할 수 있다.
 *              저장이 안 돼도 화면 동작에는 지장이 없도록 실패는 조용히 무시한다.
 */
export const safeSessionStorage = {
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
      /* noop */
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
