/**
 * 작성자: KYD
 * 기능: yd-ui 모달 고정 헤더·푸터 칸 config
 * 프로세스 설명: yd-ui modalOpen 의 config.title / config.footer 는 모달을 여는 순간 한 번만 만들어져서
 *              본문 상태("저장 중...", 비활성화, "2명 추가")를 따라가지 못한다.
 *              그래서 여는 쪽은 빈 칸만 넣어 두고(이 config), 실제 제목·버튼은 모달 본문에서
 *              ModalTitle / ModalFooter 로 그 칸에 옮겨 그린다. 상태는 본문 한 곳에만 있다.
 *
 *              사용: overlay.modalOpen({ content, config: { size: "sm", ...MODAL_SLOT_CONFIG } })
 */
import { MODAL_FOOTER_SLOT_ATTR, MODAL_TITLE_SLOT_ATTR } from "@shared/components/modal/modal-slot-constants";

export const MODAL_SLOT_CONFIG = {
  title: <span {...{ [MODAL_TITLE_SLOT_ATTR]: "" }} />,
  footer: <div className="flex w-full gap-2" {...{ [MODAL_FOOTER_SLOT_ATTR]: "" }} />,
};
