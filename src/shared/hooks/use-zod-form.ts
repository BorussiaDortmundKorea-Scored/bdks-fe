/**
 * 작성자: KYD
 * 기능: zod 스키마로 검증하는 최소 폼 상태 훅
 * 프로세스 설명: 관리자 모달들이 `useState({...})` + `handleClose` 에서 초기값을 두 번 정의하던
 *                보일러플레이트를 없애고, 제출 전 검증 결과를 필드별 에러로 돌려준다.
 *                react-hook-form 을 쓰지 않는 이유는 yd-ui 의 Input 이 forwardRef 가 아니고
 *                SelectBox/NumberInput 이 제어 컴포넌트라 Controller 래핑이 더 늘어나기 때문이다.
 */
import { useCallback, useRef, useState } from "react";

import type { z } from "zod";

/**
 * ZodError 를 `필드명 -> 첫 메시지` 로 접는다.
 * 값을 직접 들고 있지 않은 폼(SelectBox 훅이 값의 원천인 모달)도 같은 에러 모양을 쓰게 하려고 분리했다.
 */
export const toFieldErrors = <TValues>(error: z.ZodError): Partial<Record<keyof TValues & string, string>> => {
  const fieldErrors: Partial<Record<keyof TValues & string, string>> = {};

  for (const issue of error.issues) {
    const name = issue.path[0] as (keyof TValues & string) | undefined;
    // 한 필드에 규칙이 여러 개면 첫 메시지만 보여준다
    if (name && fieldErrors[name] === undefined) fieldErrors[name] = issue.message;
  }

  return fieldErrors;
};

export const useZodForm = <TSchema extends z.ZodObject<z.ZodRawShape>>(
  schema: TSchema,
  initialValues: z.input<TSchema>,
) => {
  type TValues = z.input<TSchema>;
  type TFieldName = keyof TValues & string;
  type TFieldErrors = Partial<Record<TFieldName, string>>;

  //SECTION 상태값 영역
  const [values, setValues] = useState<TValues>(initialValues);
  const [errors, setErrors] = useState<TFieldErrors>({});

  // 초기값은 렌더마다 새 객체로 넘어오므로 ref 로 붙잡는다 (수정 모달은 대상 행이 바뀌면 같이 바뀐다)
  const initialValuesRef = useRef(initialValues);
  initialValuesRef.current = initialValues;
  //!SECTION 상태값 영역

  //SECTION 메서드 영역
  /** 값을 바꾸면 그 필드의 에러는 지운다 — 고치는 중에 남아 있으면 무엇을 고쳐야 하는지 흐려진다 */
  const setValue = useCallback(<TName extends TFieldName>(name: TName, value: TValues[TName]) => {
    setValues((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => (prev[name] === undefined ? prev : { ...prev, [name]: undefined }));
  }, []);

  /** 서버가 알려준 실패를 해당 입력 밑에 붙일 때 사용한다 (중복 등) */
  const setFieldError = useCallback((name: TFieldName, message: string) => {
    setErrors((prev) => ({ ...prev, [name]: message }));
  }, []);

  const reset = useCallback(() => {
    setValues(initialValuesRef.current);
    setErrors({});
  }, []);

  /** 통과하면 파싱된 값을, 실패하면 null 을 돌려주고 필드별 에러를 채운다 */
  const validate = useCallback((): z.output<TSchema> | null => {
    const result = schema.safeParse(values);

    if (result.success) {
      setErrors({});
      return result.data;
    }

    setErrors(toFieldErrors<TValues>(result.error));

    return null;
  }, [schema, values]);
  //!SECTION 메서드 영역

  return { values, errors, setValue, setFieldError, reset, validate };
};
