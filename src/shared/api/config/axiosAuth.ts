// src/shared/api/axiosAuth.ts
import axios from "axios";

import { getAccessTokenFromSupabaseToken } from "@shared/utils/token-utils";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const axiosAuth = axios.create({
  baseURL: `${supabaseUrl}/rest/v1`,
  headers: {
    apikey: supabaseKey,
    "Content-Type": "application/json",
  },
});

// Supabase 객체 토큰에서 access_token을 동적으로 헤더에 추가하는 인터셉터
axiosAuth.interceptors.request.use((config) => {
  const token = getAccessTokenFromSupabaseToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
