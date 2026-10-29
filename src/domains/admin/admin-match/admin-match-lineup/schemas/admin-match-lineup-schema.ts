/**
 * 작성자: KYD
 * 기능: 라인업 수정·교체·경기 기록 폼 검증 스키마
 * 프로세스 설명: match_lineups 의 DB CHECK(분 범위, 투입<아웃 순서)와 같은 규칙을 FE 에서 먼저 본다.
 *                제약 위반을 서버까지 보내면 사용자는 어떤 칸이 문제인지 알 수 없는 에러만 받는다.
 */
import { z } from "zod";

import { type LineupType } from "@shared/types/match-lineup.types";

/** DB 가 허용하는 값과 어긋나면 컴파일 타임에 잡히도록 유니온에 묶어둔다 */
const LINEUP_TYPES = ["STARTING", "BENCH"] as const satisfies readonly LineupType[];

export const MATCH_MINUTE_MIN = 1;
export const MATCH_MINUTE_MAX = 120;
export const MAX_YELLOW_CARDS = 2;
export const STARTING_LINEUP_SIZE = 11;

const MINUTE_RANGE_MESSAGE = `${MATCH_MINUTE_MIN}분 이상 ${MATCH_MINUTE_MAX}분 이하로 입력해주세요`;

/** 비워두면 "해당 이벤트 없음" 이므로 null 을 허용한다 */
const optionalMinuteSchema = z
  .number()
  .int(MINUTE_RANGE_MESSAGE)
  .min(MATCH_MINUTE_MIN, MINUTE_RANGE_MESSAGE)
  .max(MATCH_MINUTE_MAX, MINUTE_RANGE_MESSAGE)
  .nullable();

export const adminMatchLineupFormSchema = z
  .object({
    player_id: z.string().min(1, "선수를 선택해주세요"),
    position_id: z.string().nullable(),
    lineup_type: z.enum(LINEUP_TYPES, { message: "라인업 타입을 선택해주세요" }),
    is_captain: z.boolean(),
    sub_in_minute: optionalMinuteSchema,
    sub_in_partner_id: z.string().nullable(),
    sub_out_minute: optionalMinuteSchema,
    sub_out_partner_id: z.string().nullable(),
    yellow_cards: z.number().int().min(0).max(MAX_YELLOW_CARDS, `옐로우 카드는 ${MAX_YELLOW_CARDS}장까지예요`),
    red_card_minute: optionalMinuteSchema,
    is_sent_off: z.boolean(),
    goals: z.number().int().min(0, "골은 0 이상이어야 해요"),
    assists: z.number().int().min(0, "어시스트는 0 이상이어야 해요"),
  })
  .superRefine((values, ctx) => {
    // sub-for-sub: 투입됐다가 다시 아웃되는 선수는 두 시점이 순서대로여야 한다 (DB CHECK 와 동일)
    if (
      values.sub_in_minute != null &&
      values.sub_out_minute != null &&
      values.sub_out_minute <= values.sub_in_minute
    ) {
      ctx.addIssue({
        code: "custom",
        path: ["sub_out_minute"],
        message: "교체 아웃 시간은 투입 시간보다 뒤여야 해요",
      });
    }

    if (values.is_sent_off && values.red_card_minute == null) {
      ctx.addIssue({ code: "custom", path: ["red_card_minute"], message: "퇴장 시간을 입력해주세요" });
    }
  });

export type IAdminMatchLineupFormValues = z.infer<typeof adminMatchLineupFormSchema>;

export const ADMIN_MATCH_LINEUP_FORM_INITIAL_VALUES: IAdminMatchLineupFormValues = {
  player_id: "",
  position_id: null,
  lineup_type: "STARTING",
  is_captain: false,
  sub_in_minute: null,
  sub_in_partner_id: null,
  sub_out_minute: null,
  sub_out_partner_id: null,
  yellow_cards: 0,
  red_card_minute: null,
  is_sent_off: false,
  goals: 0,
  assists: 0,
};

export const adminMatchLineupSubstitutionSchema = z.object({
  partner_player_id: z.string().min(1, "교체로 들어올 선수를 선택해주세요"),
  substitution_minute: z
    .number({ message: `교체 시간을 ${MINUTE_RANGE_MESSAGE}` })
    .int(`교체 시간을 ${MINUTE_RANGE_MESSAGE}`)
    .min(MATCH_MINUTE_MIN, `교체 시간을 ${MINUTE_RANGE_MESSAGE}`)
    .max(MATCH_MINUTE_MAX, `교체 시간을 ${MINUTE_RANGE_MESSAGE}`),
});

export type IAdminMatchLineupSubstitutionValues = z.infer<typeof adminMatchLineupSubstitutionSchema>;
