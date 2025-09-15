/**
 * 작성자: KYD
 * 기능:
 * 프로세스 설명: 프로세스 복잡시 노션링크 첨부권장
 */
import { useNavigate } from "react-router-dom";

import { ArrowLeft } from "lucide-react";

import AdminWrapper from "@admin/provider/admin-wrapper";

const AdminMatchPage = () => {
  //SECTION HOOK호출 영역
  const navigate = useNavigate();
  //!SECTION HOOK호출 영역

  //SECTION 상태값 영역

  //!SECTION 상태값 영역

  //SECTION 메서드 영역

  //!SECTION 메서드 영역

  return (
    <AdminWrapper>
      <header className="w-full flex layout-header-height items-center relative">
        <ArrowLeft
          size={24}
          className="text-primary-400 cursor-pointer"
          onClick={() => navigate(-1)}
          aria-label="뒤로가기"
        />
        <h1 className="text-primary-400 font-shilla-culture absolute left-1/2 -translate-x-1/2 text-2xl font-bold">
          관리자 페이지
        </h1>
      </header>
    </AdminWrapper>
  );
};

export default AdminMatchPage;
