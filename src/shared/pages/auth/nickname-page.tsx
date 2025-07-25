/**
 * 작성자: KYD
 * 기능: 닉네임 설정 페이지
 * 프로세스 설명: 로그인 후 최초 사용자의 닉네임을 설정하는 페이지
 */

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../api/supabaseClient";
import { useAuth } from "../../contexts/AuthContext";

const NicknamePage = () => {
  const [nickname, setNickname] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { user, refreshProfile } = useAuth();

  // AuthContext에서 로딩 중이거나 user가 없으면 로딩 화면 표시
  if (!user) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      console.log("닉네임 저장 시작:", nickname.trim());

      // profiles 테이블에 닉네임 저장
      const { error } = await supabase.from("profiles").insert({
        id: user.id,
        nickname: nickname.trim(),
      });

      if (error) {
        console.error("닉네임 저장 오류:", error);
        if (error.code === "23505") {
          // unique constraint violation
          setError("이미 사용 중인 닉네임입니다.");
        } else {
          setError("닉네임 저장 중 오류가 발생했습니다.");
        }
        return;
      }

      // 프로필 정보 새로고침
      await refreshProfile();

      // 성공 시 대시보드로 이동
      navigate("/dashboard", { replace: true });
    } catch (err) {
      console.error("닉네임 저장 예외:", err);
      setError("예상치 못한 오류가 발생했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold text-center mb-8">닉네임 설정</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="nickname" className="block text-sm font-medium text-gray-700 mb-2">
              닉네임
            </label>
            <input
              id="nickname"
              type="text"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="닉네임을 입력하세요"
              required
              minLength={2}
              maxLength={20}
            />
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <button
            type="submit"
            disabled={isLoading || !nickname.trim()}
            className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {isLoading ? "저장 중..." : "닉네임 설정 완료"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default NicknamePage;
