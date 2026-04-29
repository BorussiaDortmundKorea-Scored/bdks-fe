/**
 * 작성자: KYD
 * 기능:
 * 프로세스 설명: 프로세스 복잡시 노션링크 첨부권장
 */
import { useNavigate } from "react-router-dom";

import { ArrowLeft } from "lucide-react";

const BackButton = () => {
  //SECTION HOOK호출 영역
  const navigate = useNavigate();

  //!SECTION HOOK호출 영역

  //SECTION 상태값 영역

  //!SECTION 상태값 영역

  //SECTION 메서드 영역

  //!SECTION 메서드 영역

  return (
    <button onClick={() => navigate(-1)} aria-label="뒤로가기" className="flex cursor-pointer">
      <ArrowLeft size={24} className="text-primary-100" />
    </button>
  );
};

export default BackButton;
