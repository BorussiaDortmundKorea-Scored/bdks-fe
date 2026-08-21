/**
 * 작성자: KYD
 * 기능: Supabase RPC 호출 공통 래퍼
 * 프로세스 설명: rpc 빌더 실행 결과를 ApiResponse<T>로 표준화. 도메인 api 함수의 as 이중캐스팅 보일러플레이트 제거용
 */
import { type ApiResponse, type PostgrestError } from "@shared/api/types/api-types";

/**
 * supabase.rpc(...) 호출을 ApiResponse<T>로 감싼다.
 * - data 캐스팅(as T)을 이 한 곳으로 집약해 도메인 api 파일에서 캐스팅을 제거한다.
 * - error는 PostgrestError | null 로 정직하게 전달한다.
 *
 * @example
 * export const getTransfers = () =>
 *   callRpc<ITransfer[]>(() => supabase.rpc("get_transfers"));
 */
export const callRpc = async <T>(
  build: () => PromiseLike<{ data: unknown; error: PostgrestError | null }>,
): Promise<ApiResponse<T>> => {
  const { data, error } = await build();
  return { data: data as T, error };
};
