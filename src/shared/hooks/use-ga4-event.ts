/**
 * 작성자: KYD
 * 기능: GA4 커스텀 이벤트 트래킹 훅
 * 프로세스 설명: react-ga4의 event API를 래핑하여 도메인에서 일관된 방식으로 이벤트 전송
 */
import ReactGA from "react-ga4";

type Ga4EventParams = {
  action: string;
  category: string;
  label?: string;
  value?: number;
  [key: string]: unknown;
};

export const useGa4Event = () => {
  const trackEvent = (params: Ga4EventParams) => {
    const { action, category, label, value, ...rest } = params;

    ReactGA.event({
      action,
      category,
      label,
      value,
      ...rest,
    });
  };

  return { trackEvent };
};

