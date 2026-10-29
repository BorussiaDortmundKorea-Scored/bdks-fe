/**
 * 작성자: KYD
 * 기능: 모달 제목 — yd-ui 고정 헤더에 그린다
 * 프로세스 설명: MODAL_SLOT_CONFIG 로 연 모달이면 헤더(h2) 칸에 들어가 스크롤해도 항상 보인다.
 *              칸이 없으면 본문 맨 위에 h2 로 그린다.
 */
import { type ReactNode } from "react";

import { MODAL_TITLE_SLOT_ATTR } from "@shared/components/modal/modal-slot-constants";
import ModalSlotPortal from "@shared/components/modal/modal-slot-portal";

const ModalTitle = ({ children }: { children: ReactNode }) => {
  return (
    <ModalSlotPortal slotAttr={MODAL_TITLE_SLOT_ATTR} fallback={<h2 className="text-yds-s1 text-white">{children}</h2>}>
      {children}
    </ModalSlotPortal>
  );
};

export default ModalTitle;
