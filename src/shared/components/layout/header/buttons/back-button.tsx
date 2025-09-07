/**
 * 작성자: KYD
 * 기능:
 * 프로세스 설명: 프로세스 복잡시 노션링크 첨부권장
 */
import { useNavigate } from "react-router-dom";

import { ArrowLeft } from "lucide-react";

interface IBackButton {}

const BackButton: React.FC<IBackButton> = () => {
  //SECTION HOOK호출 영역
  const navigate = useNavigate();

  //!SECTION HOOK호출 영역

  //SECTION 상태값 영역

  //!SECTION 상태값 영역

  //SECTION 메서드 영역

  //!SECTION 메서드 영역

  return (
    <ArrowLeft onClick={() => navigate(-1)} size={24} className="text-primary-100 absolute left-1 cursor-pointer" />
  );
};

export default BackButton;
