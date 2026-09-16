/**
 * 작성자: KYD
 * 기능: 팀 추가/수정 폼 검증 스키마
 * 프로세스 설명: 국가는 선택값이라 스키마에 넣지 않고 SelectBox 훅이 그대로 들고 있는다
 */
import { z } from "zod";

export const adminTeamFormSchema = z.object({
  name: z.string().trim().min(1, "팀명을 입력해주세요"),
  image_name: z.string().trim(),
});

export type IAdminTeamFormValues = z.infer<typeof adminTeamFormSchema>;

export const ADMIN_TEAM_FORM_INITIAL_VALUES: IAdminTeamFormValues = {
  name: "",
  image_name: "",
};
