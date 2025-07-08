// src/shared/api/axiosPrivate.ts
import axios from "axios";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const axiosPrivate = axios.create({
  baseURL: `${supabaseUrl}/rest/v1`,
  headers: {
    apikey: supabaseKey,
    "Content-Type": "application/json",
  },
});

// accessToken을 동적으로 헤더에 추가하는 인터셉터
axiosPrivate.interceptors.request.use((config) => {
  const token = localStorage.getItem("access_token"); // 필요에 따라 수정
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
