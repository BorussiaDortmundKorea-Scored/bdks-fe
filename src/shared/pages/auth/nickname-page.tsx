/**
 * 작성자: KYD
 * 기능:
 * 프로세스 설명: 프로세스 복잡시 노션링크 첨부권장
 */
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { supabase } from "../../api/supabaseClient";

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
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow-md">
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
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="닉네임을 입력하세요"
              disabled={isLoading}
            />
          </div>

          {error && <div className="text-red-600 text-sm text-center">{error}</div>}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
          >
            {isLoading ? "설정 중..." : "닉네임 설정"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default NicknamePage;
