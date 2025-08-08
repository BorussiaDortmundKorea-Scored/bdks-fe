/**
 * 작성자: KYD
 * 기능:
 * 프로세스 설명: 프로세스 복잡시 노션링크 첨부권장
 */
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../domains/auth/contexts/AuthContext";
import { supabase } from "@shared/api/config/supabaseClient";

const NicknamePage = () => {
  const [nickname, setNickname] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nickname.trim()) {
      setError("닉네임을 입력해주세요.");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const { error } = await supabase.from("profiles").insert({
        id: user?.id,
        nickname: nickname.trim(),
      });

      if (error) {
        if (error.code === "23505") {
          setError("이미 사용 중인 닉네임입니다.");
        } else {
          setError("닉네임 설정 중 오류가 발생했습니다.");
        }
        return;
      }
      // 대시보드로 이동
      navigate("/dashboard", { replace: true });
    } catch (err) {
      setError("닉네임 설정 중 오류가 발생했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="w-full max-w-md space-y-8 rounded-lg bg-white p-8 shadow-md">
        <div>
          <h2 className="text-center text-3xl font-bold text-gray-900">닉네임 설정</h2>
          <p className="mt-2 text-center text-sm text-gray-600">사용할 닉네임을 입력해주세요</p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="nickname" className="block text-sm font-medium text-gray-700">
              닉네임
            </label>
            <input
              id="nickname"
              name="nickname"
              type="text"
              required
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500 focus:outline-none"
              placeholder="닉네임을 입력하세요"
              disabled={isLoading}
            />
          </div>

          {error && <div className="text-center text-sm text-red-600">{error}</div>}

          <button
            type="submit"
            disabled={isLoading}
            className="flex w-full justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none disabled:opacity-50"
          >
            {isLoading ? "설정 중..." : "닉네임 설정"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default NicknamePage;
