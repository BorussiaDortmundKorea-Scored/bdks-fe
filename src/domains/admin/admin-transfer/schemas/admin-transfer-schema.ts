/**
 * 작성자: KYD
 * 기능: 이적 추가/수정 폼 검증 스키마
 * 프로세스 설명: 이 폼은 값의 원천이 SelectBox 훅이라, 제출 직전에 payload 를 조립해 한 번 검증한다.
 *                상대 클럽은 자유계약·유스 이적에서 비므로 선택값이다.
 *                은퇴는 방출만 가능하다 (DB CHECK 와 같은 규칙을 제출 전에 알려준다).
 */
import { z } from "zod";

import { isRetiredType } from "@admin/admin-transfer/constants/transfer-options";

export const adminTransferFormSchema = z
  .object({
    player_id: z.string().min(1, "선수를 선택해주세요"),
    direction: z.string().min(1, "영입/방출을 선택해주세요"),
    transfer_type: z.string().min(1, "유형을 선택해주세요"),
    counterpart_team_id: z.string().nullable(),
    transfer_date: z.string().nullable(),
    euro_fee: z.number().min(0, "이적금액은 0 이상이어야 해요").nullable(),
  })
  .refine((values) => !isRetiredType(values.transfer_type) || values.direction === "OUT", {
    path: ["direction"],
    message: "은퇴는 방출로 선택해주세요",
  });

export type IAdminTransferFormValues = z.infer<typeof adminTransferFormSchema>;
