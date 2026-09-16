/**
 * 작성자: KYD
 * 기능: 경기 추가/수정 폼 검증 스키마
 * 프로세스 설명: 대회·상대팀은 SelectBox 훅이 값의 원천이라 제출 직전에 payload 를 조립해 검증한다.
 *                일괄 추가는 같은 규칙을 행마다 돌려 어떤 행이 비었는지 짚어준다.
 */
import { z } from "zod";

import { type HomeAway } from "@shared/types/match.types";

/** DB 가 허용하는 값과 어긋나면 컴파일 타임에 잡히도록 유니온에 묶어둔다 */
const HOME_AWAY_VALUES = ["HOME", "AWAY"] as const satisfies readonly HomeAway[];

export const adminMatchFormSchema = z.object({
  competition_id: z.string().min(1, "대회를 선택해주세요"),
  opponent_team_id: z.string().min(1, "상대팀을 선택해주세요"),
  match_start_time: z.string().min(1, "경기 시작 시간을 입력해주세요"),
  home_away: z.enum(HOME_AWAY_VALUES, { message: "홈/어웨이를 선택해주세요" }),
  round_name: z.string().trim(),
});

export type IAdminMatchFormValues = z.infer<typeof adminMatchFormSchema>;

/** 수정 모달은 점수·포메이션과 전후반 시각까지 직접 손댈 수 있다 */
export const adminMatchEditFormSchema = adminMatchFormSchema
  .extend({
    our_score: z.number().int().min(0, "점수는 0 이상이어야 해요"),
    opponent_score: z.number().int().min(0, "점수는 0 이상이어야 해요"),
    formation: z.string().trim(),
    is_live: z.boolean(),
    first_half_end_time: z.string(),
    second_half_start_time: z.string(),
    second_half_end_time: z.string(),
  })
  .superRefine((values, ctx) => {
    // 시각이 뒤섞이면 라이브 판정·경기 종료 판정이 조용히 틀어진다
    const sequence = [
      { field: "first_half_end_time", label: "전반 종료", prev: values.match_start_time, prevLabel: "경기 시작" },
      {
        field: "second_half_start_time",
        label: "후반 시작",
        prev: values.first_half_end_time,
        prevLabel: "전반 종료",
      },
      {
        field: "second_half_end_time",
        label: "후반 종료",
        prev: values.second_half_start_time,
        prevLabel: "후반 시작",
      },
    ] as const;

    for (const step of sequence) {
      const current = values[step.field];
      if (!current || !step.prev) continue;
      if (new Date(current) > new Date(step.prev)) continue;

      ctx.addIssue({
        code: "custom",
        path: [step.field],
        message: `${step.label}은 ${step.prevLabel}보다 뒤여야 해요`,
      });
    }
  });

export type IAdminMatchEditFormValues = z.infer<typeof adminMatchEditFormSchema>;
