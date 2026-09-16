/**
 * 작성자: KYD
 * 기능: 선수 추가/수정 폼 검증 스키마
 * 프로세스 설명: 등번호처럼 형식이 정해진 값은 서버 왕복 없이 제출 전에 거른다.
 *                입력값은 전부 문자열로 다루고(빈 문자열 = 미입력), API 로 보낼 때만 숫자로 바꾼다.
 */
import { z } from "zod";

export const JERSEY_NUMBER_MIN = 0;
export const JERSEY_NUMBER_MAX = 99;

/** 선택 입력이라 빈 문자열을 허용하고, 값이 있을 때만 범위를 본다 */
const jerseyNumberSchema = z
  .string()
  .trim()
  .refine(
    (value) =>
      value === "" || (/^\d+$/.test(value) && Number(value) >= JERSEY_NUMBER_MIN && Number(value) <= JERSEY_NUMBER_MAX),
    `등번호는 ${JERSEY_NUMBER_MIN}~${JERSEY_NUMBER_MAX} 사이로 입력해주세요`,
  );

export const adminPlayerFormSchema = z.object({
  name: z.string().trim().min(1, "선수 이름을 입력해주세요"),
  korean_name: z.string().trim(),
  jersey_number: jerseyNumberSchema,
  nationality: z.string().trim(),
  image_name: z.string().trim(),
});

export type IAdminPlayerFormValues = z.infer<typeof adminPlayerFormSchema>;

export const ADMIN_PLAYER_FORM_INITIAL_VALUES: IAdminPlayerFormValues = {
  name: "",
  korean_name: "",
  jersey_number: "",
  nationality: "",
  image_name: "",
};
