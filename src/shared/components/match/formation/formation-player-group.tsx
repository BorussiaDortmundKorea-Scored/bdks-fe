/**
 * 작성자: KYD
 * 기능: 포메이션 보드 "교체" 화면의 선수 묶음 한 칸 (제목 + 카드 줄)
 * 프로세스 설명: 교체 아웃 · 미출전 · 후보처럼 줄 배치가 없는 선수들을 제목 아래 감싸서 늘어놓는다.
 *              사용자 평점 화면과 관리자 라인업 보드가 같은 모양을 쓰도록 떼어 냈다.
 */
import { type ReactNode } from "react";

interface IFormationPlayerGroupProps {
  title: ReactNode;
  /** 제목 아래 안내 문구 (예: 데이터 확인이 필요한 선수) */
  description?: ReactNode;
  children: ReactNode;
}

const FormationPlayerGroup = ({ title, description, children }: IFormationPlayerGroupProps) => {
  return (
    <section className="flex flex-col gap-2">
      <span className="text-yds-b2 text-white">{title}</span>
      {description && <p className="text-yds-c1r text-yellow-500">{description}</p>}
      <div className="flex flex-wrap gap-3">{children}</div>
    </section>
  );
};

export default FormationPlayerGroup;
