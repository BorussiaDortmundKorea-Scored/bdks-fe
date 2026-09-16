/**
 * 작성자: KYD
 * 기능: 대회 추가/수정 폼 검증 스키마
 * 프로세스 설명: 두 값 모두 SelectBox 로 고르므로 "선택했는지"만 본다.
 *                competitionTypeName 은 화면 표시값(대회명)이고, 제출 시 id 로 바꾼다.
 */
import { z } from "zod";

export const adminCompetitionFormSchema = z.object({
  competitionTypeName: z.string().min(1, "대회 종류를 선택해주세요"),
  season: z.string().min(1, "시즌을 선택해주세요"),
});

export type IAdminCompetitionFormValues = z.infer<typeof adminCompetitionFormSchema>;

export const ADMIN_COMPETITION_FORM_INITIAL_VALUES: IAdminCompetitionFormValues = {
  competitionTypeName: "",
  season: "",
};
