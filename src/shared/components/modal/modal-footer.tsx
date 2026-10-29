/**
 * 작성자: KYD
 * 기능: 모달 하단 버튼 — yd-ui 고정 푸터에 그린다
 * 프로세스 설명: MODAL_SLOT_CONFIG 로 연 모달이면 푸터 칸에 들어가 본문을 스크롤해도 항상 보인다.
 *              버튼은 본문 컴포넌트 안에서 그리므로 "저장 중..."·비활성화 같은 상태를 그대로 따라간다.
 *              칸이 없으면 본문 맨 아래에 그린다.
 */
import { type ReactNode } from "react";

import { MODAL_FOOTER_SLOT_ATTR } from "@shared/components/modal/modal-slot-constants";
import ModalSlotPortal from "@shared/components/modal/modal-slot-portal";

const ModalFooter = ({ children }: { children: ReactNode }) => {
  return (
    <ModalSlotPortal slotAttr={MODAL_FOOTER_SLOT_ATTR} fallback={<div className="flex gap-2">{children}</div>}>
      {children}
    </ModalSlotPortal>
  );
};

export default ModalFooter;
