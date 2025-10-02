// src/domains/auth/components/delete-account-button.tsx
import { useState } from "react";

import { Button } from "@youngduck/yd-ui";

import { useAuth } from "@auth/contexts/AuthContext";

const DeleteAccountButton = () => {
  const [showConfirm, setShowConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const { deleteAccount } = useAuth();

  const handleDeleteAccount = async () => {
    if (!showConfirm) {
      setShowConfirm(true);
      return;
    }

    setIsDeleting(true);
    try {
      const result = await deleteAccount();

      if (result.success) {
        alert(result.message || "회원탈퇴가 완료되었습니다.");
        // 성공 시 AuthContext에서 자동으로 로그아웃 처리됨
      } else {
        alert(result.error || "회원탈퇴 중 오류가 발생했습니다.");
        setShowConfirm(false);
      }
    } catch (error) {
      console.error("회원탈퇴 오류:", error);
      alert("회원탈퇴 중 오류가 발생했습니다.");
      setShowConfirm(false);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleCancel = () => {
    setShowConfirm(false);
  };

  return (
    <div className="flex flex-col gap-2">
      {showConfirm ? (
        <>
          <p className="text-sm text-red-500">
            정말로 회원탈퇴를 하시겠습니까?
            <br />
            모든 데이터가 삭제되며 복구할 수 없습니다.
          </p>
          <div className="flex gap-2">
            <Button variant="fill" size="full" onClick={handleDeleteAccount} disabled={isDeleting}>
              {isDeleting ? "처리 중..." : "탈퇴하기"}
            </Button>
            <Button variant="outlined" size="full" onClick={handleCancel} disabled={isDeleting}>
              취소
            </Button>
          </div>
        </>
      ) : (
        <Button variant="outlined" size="full" onClick={handleDeleteAccount} disabled={isDeleting}>
          회원탈퇴
        </Button>
      )}
    </div>
  );
};

export default DeleteAccountButton;
