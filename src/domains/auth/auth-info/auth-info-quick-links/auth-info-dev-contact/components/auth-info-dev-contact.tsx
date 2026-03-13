
/**
 * 작성자: KYD
 * 기능: 개발자에게 문의, 버그제보, 제안 등 메일 전송 컴포넌트
 */

import { useState } from "react";

import emailjs from "@emailjs/browser";
import { useAuth } from "@auth/contexts/AuthContext";
import { Button } from "@youngduck/yd-ui";
import LayoutWithHeaderFooter from "@shared/provider/layout-with-header-footer";

interface DevContactFormValues {
  title: string;
  name: string;
  message: string;
}

const AuthInfoDevContact = () => {
  //SECTION HOOK호출 영역
  const { profile } = useAuth();
  const userName = profile?.nickname ?? "";
  const [formValues, setFormValues] = useState<DevContactFormValues>({
    title: "",
    name: userName,
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState<"idle" | "success" | "error">("idle");
  //!SECTION HOOK호출 영역

  //SECTION 메서드 영역
  const handleChange =
    (field: keyof DevContactFormValues) =>
    (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setFormValues((prev) => ({
        ...prev,
        [field]: event.target.value,
      }));
    };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!formValues.title.trim() || !formValues.message.trim()) {
      return;
    }

    const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;
    const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
    const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

    if (!serviceId || !templateId || !publicKey) {
      setResult("error");
      return;
    }

    setIsSubmitting(true);
    setResult("idle");

    try {
      await emailjs.send(
        serviceId,
        templateId,
        {
          title: formValues.title,
          name: formValues.name || "익명",
          message: formValues.message,
        },
        publicKey,
      );

      setResult("success");
      setFormValues({
        title: "",
        name: userName,
        message: "",
      });
    } catch{
      setResult("error");
    } finally {
      setIsSubmitting(false);
    }
  };
  //!SECTION 메서드 영역

  const isSubmitDisabled = isSubmitting || !formValues.title.trim() || !formValues.message.trim();

  return (
    <form className="w-full" onSubmit={handleSubmit}>
      <LayoutWithHeaderFooter>
        <label className="flex flex-col gap-2 text-primary-100">
          <p className="text-yds-s2 text-white">건의 / 버그 제보</p>
        </label>
        <input
          type="text"
          value={formValues.title}
          onChange={handleChange("title")}
          required
          className="bg-background-secondary text-white rounded px-3 py-4 placeholder:text-primary-70 outline-none"
          placeholder="제목"
        />
        <textarea
          value={formValues.message}
          onChange={handleChange("message")}
          placeholder="서비스 사용 중 불편한 점이나 소중한 아이디어가 있다면 편하게 남겨 주세요."
          className="min-h-[240px] resize-none rounded bg-background-secondary px-3 py-2 text-white placeholder:text-primary-70 outline-none"
        />
        {result === "success" && (
          <p className="text-yds-c1m text-primary-100">소중한 의견 감사합니다! 메일이 정상적으로 전송되었어요.</p>
        )}
        {result === "error" && (
          <p className="text-yds-c1m text-red-400">
            메일 전송에 실패했습니다. 잠시 후 다시 시도해주세요
          </p>
        )}
      </LayoutWithHeaderFooter>
      <div className="flex h-auto w-full items-center justify-center">
        <Button type="submit" size="full" disabled={isSubmitDisabled}>
          {isSubmitting ? "전송 중..." : "문의하기"}
        </Button>
      </div>
    </form>
  );
};

export default AuthInfoDevContact;