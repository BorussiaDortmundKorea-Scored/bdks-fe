/**
 * 작성자: KYD
 * 기능: 사용자 관리 컴포넌트 - 사용자 조회 및 탈퇴 기능
 * 프로세스 설명: 사용자 목록 조회, 강제 탈퇴 기능 제공
 */
import { useState } from "react";

import { Trash2 } from "lucide-react";

import type { IUser } from "@admin/admin-user/api/admin-user-api";
import { useDeleteUser } from "@admin/admin-user/api/react-query-api/use-delete-user";
import { useGetAllUsersSuspense } from "@admin/admin-user/api/react-query-api/use-get-all-users-suspense";

const AdminUser = () => {
  //SECTION HOOK호출 영역
  const { data: users } = useGetAllUsersSuspense();
  const { mutateAsync: deleteUser, isPending: isDeleting } = useDeleteUser();
  //!SECTION HOOK호출 영역

  //SECTION 상태값 영역
  const [deletingUserId, setDeletingUserId] = useState<string | null>(null);
  //!SECTION 상태값 영역

  //SECTION 메서드 영역
  const handleDeleteUser = async (user: IUser) => {
    if (user.is_admin) {
      alert("관리자는 탈퇴시킬 수 없습니다.");
      return;
    }

    if (
      !confirm(`정말로 "${user.nickname}" 사용자를 탈퇴시키시겠습니까?\n모든 데이터가 삭제되며 복구할 수 없습니다.`)
    ) {
      return;
    }

    setDeletingUserId(user.id);
    try {
      const result = await deleteUser(user.id);

      if (result.success) {
        alert(result.message || "사용자 탈퇴가 완료되었습니다.");
      } else {
        alert(result.error || "사용자 탈퇴 중 오류가 발생했습니다.");
      }
    } catch (error) {
      console.error("사용자 탈퇴 오류:", error);
      alert("사용자 탈퇴 중 오류가 발생했습니다.");
    } finally {
      setDeletingUserId(null);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("ko-KR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };
  //!SECTION 메서드 영역

  return (
    <div className="flex h-full w-full flex-col">
      {/* 헤더 */}
      <div className="flex w-full items-center justify-between p-4">
        <h2 className="text-yds-s1 text-primary-100">사용자 관리</h2>
        <div className="text-yds-c1m text-primary-100">
          총 {users.length}명 (관리자: {users.filter((u) => u.is_admin).length}명)
        </div>
      </div>

      {/* 스크롤 가능한 컨텐츠 영역 */}
      <div className="scrollbar-hide border-primary-100 flex w-full flex-1 flex-col gap-4 overflow-y-auto rounded-lg border-2">
        <table className="w-full">
          <thead className="bg-background-primary text-primary-400 border-primary-100 text-yds-b1 border-b-2">
            <tr className="h-12">
              <th className="px-6 text-left uppercase">닉네임</th>
              <th className="px-6 text-left uppercase">이메일</th>
              <th className="px-6 text-left uppercase">권한</th>
              <th className="px-6 text-left uppercase">가입일</th>
              <th className="px-6 text-left uppercase">최근 로그인</th>
              <th className="px-6 text-left uppercase">작업</th>
            </tr>
          </thead>
          <tbody className="bg-background-primary">
            {users.map((user) => (
              <tr key={user.id} className="hover:bg-primary-100/5 h-12">
                <td className="text-primary-100 px-6 py-4 text-sm font-medium whitespace-nowrap">{user.nickname}</td>
                <td className="text-primary-100 px-6 py-4 text-sm whitespace-nowrap">{user.email || "익명 사용자"}</td>
                <td className="px-6 py-4 text-sm whitespace-nowrap">
                  {user.is_admin ? (
                    <span className="rounded-full bg-yellow-500/20 px-2 py-1 text-xs font-medium text-yellow-400">
                      관리자
                    </span>
                  ) : (
                    <span className="text-primary-100 rounded-full bg-blue-500/20 px-2 py-1 text-xs font-medium">
                      일반
                    </span>
                  )}
                </td>
                <td className="text-primary-100 px-6 py-4 text-sm whitespace-nowrap">{formatDate(user.created_at)}</td>
                <td className="text-primary-100 px-6 py-4 text-sm whitespace-nowrap">
                  {user.last_sign_in_at ? formatDate(user.last_sign_in_at) : "-"}
                </td>
                <td className="px-6 py-4 text-sm font-medium whitespace-nowrap">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => handleDeleteUser(user)}
                      disabled={isDeleting && deletingUserId === user.id}
                      className={`cursor-pointer rounded-md p-1 transition-colors ${
                        user.is_admin
                          ? "cursor-not-allowed text-gray-500 opacity-50"
                          : "text-red-400 hover:bg-red-500/20 hover:text-white"
                      }`}
                      aria-label="사용자 탈퇴"
                      title={user.is_admin ? "관리자는 탈퇴시킬 수 없습니다" : "사용자 탈퇴"}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminUser;
