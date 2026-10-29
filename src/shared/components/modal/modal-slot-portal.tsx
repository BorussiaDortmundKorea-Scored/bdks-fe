/**
 * 작성자: KYD
 * 기능: 모달 본문의 내용을 같은 다이얼로그의 고정 칸(헤더·푸터)으로 옮겨 그린다
 * 프로세스 설명: 자기 위치에서 가장 가까운 [role="dialog"] 를 찾고, 그 안에서 slotAttr 속성을 가진 칸에 portal 한다.
 *              칸이 없으면(MODAL_SLOT_CONFIG 없이 열었거나, 테스트에서 본문만 렌더할 때) fallback 으로 제자리에 그린다.
 *              useLayoutEffect 로 칸을 찾으므로 제자리에 잠깐 그려진 모습은 화면에 칠해지지 않는다.
 */
import { type ReactNode, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

interface IModalSlotPortalProps {
  slotAttr: string;
  /** 칸을 못 찾았을 때 제자리에 그릴 모습 */
  fallback: ReactNode;
  children: ReactNode;
}

const ModalSlotPortal = ({ slotAttr, fallback, children }: IModalSlotPortalProps) => {
  //SECTION HOOK호출 영역
  const anchorRef = useRef<HTMLSpanElement>(null);
  const [target, setTarget] = useState<Element | null>(null);

  useLayoutEffect(() => {
    const dialog = anchorRef.current?.closest('[role="dialog"]');
    setTarget(dialog?.querySelector(`[${slotAttr}]`) ?? null);
  }, [slotAttr]);
  //!SECTION HOOK호출 영역

  return (
    <>
      <span ref={anchorRef} hidden />
      {target ? createPortal(children, target) : fallback}
    </>
  );
};

export default ModalSlotPortal;
