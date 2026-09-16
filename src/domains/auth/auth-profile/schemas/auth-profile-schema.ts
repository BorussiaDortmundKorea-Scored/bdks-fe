/**
 * 작성자: KYD
 * 기능: 프로필 생성 폼 검증 스키마
 * 프로세스 설명: 빈 값·길이는 서버 왕복 없이 제출 전에 거른다.
 *                닉네임 중복만 서버가 알 수 있으므로 그것만 RPC 응답으로 처리한다.
 *                insert_auth_profile 도 trim 후 길이를 보므로 규칙이 서로 어긋나지 않는다.
 */
import { z } from "zod";

export const NICKNAME_MAX_LENGTH = 20;

export const nicknameSchema = z
  .string()
  .trim()
  .min(1, "닉네임을 입력해주세요")
  .max(NICKNAME_MAX_LENGTH, `닉네임은 ${NICKNAME_MAX_LENGTH}자까지 입력할 수 있어요`);

export const authProfileFormSchema = z.object({
  nickname: nicknameSchema,
  favoritePlayer: z.string().optional(),
});

export type IAuthProfileFormValues = z.infer<typeof authProfileFormSchema>;
