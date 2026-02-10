/**
 * 작성자: KYD
 * 기능: 마이페이지 상단 인사말 컴포넌트
 */
import { useAuth } from "@auth/contexts/AuthContext";

const AuthInfoGreeting = () => {
  const { user, profile } = useAuth();

  const userName = profile?.nickname || user?.email?.split("@")[0] || "회원";

  return (
    <h1 className="text-yds-s2 text-primary-100 mt-4">
      {userName}님,
      <br />
      HEJA BVB!
    </h1>
  );
};

export default AuthInfoGreeting;
