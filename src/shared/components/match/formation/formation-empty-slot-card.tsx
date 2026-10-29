/**
 * 작성자: KYD
 * 기능: 포메이션 빈 자리 · 추가 카드 (관리자 라인업 보드)
 * 프로세스 설명: 선수 카드와 같은 크기·다이아몬드 칸에 점선 테두리 + 자리 이름을 그린다.
 *              크기를 공유하므로 빈 자리가 섞여도 줄 배치가 사용자 평점 화면과 똑같이 나온다.
 */
import { Plus } from "lucide-react";

import {
  AVATAR_CLASS,
  CARD_CONTAINER_CLASS,
  DIAMOND_CLASS,
} from "@shared/components/match/formation/formation-card-styles";

interface IFormationEmptySlotCardProps {
  /** 칸에 찍히는 이름 (예: ST, 후보) */
  label: string;
  /** 스크린리더·툴팁 문구. 없으면 "{label} 비어 있음" */
  actionLabel?: string;
  onClick: () => void;
}

const FormationEmptySlotCard = ({ label, actionLabel, onClick }: IFormationEmptySlotCardProps) => {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={actionLabel ?? `${label} 비어 있음`}
      title={actionLabel ?? `${label} 자리에 선수 배치`}
      className={`${CARD_CONTAINER_CLASS} group cursor-pointer`}
    >
      <div className={AVATAR_CLASS}>
        <div
          aria-hidden="true"
          className={`absolute ${DIAMOND_CLASS} border-dashed bg-black/50 transition-colors group-hover:bg-black/70`}
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-0.5">
          <Plus size={14} className="text-primary-400" aria-hidden="true" />
          <span className="text-primary-100 text-[10px] leading-none font-bold">{label}</span>
        </div>
      </div>
    </button>
  );
};

export default FormationEmptySlotCard;
