import { PostgrestError } from "@supabase/supabase-js";

// API 응답 타입 정의
export interface ApiResponse<T> {
  data: T;
  error: PostgrestError;
}

// Suabase PostgrestError 타입
// Barrel Export 형식으로 정의
export type { PostgrestError };
