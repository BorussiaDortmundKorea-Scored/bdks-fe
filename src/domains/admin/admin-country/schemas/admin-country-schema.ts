/**
 * 작성자: KYD
 * 기능: 국가 추가/수정 폼 검증 스키마
 */
import { z } from "zod";

export const adminCountryFormSchema = z.object({
  name: z.string().trim().min(1, "국가명을 입력해주세요"),
});

export type IAdminCountryFormValues = z.infer<typeof adminCountryFormSchema>;

export const ADMIN_COUNTRY_FORM_INITIAL_VALUES: IAdminCountryFormValues = {
  name: "",
};
