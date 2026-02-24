/**
 * 작성자: KYD
 * 기능: SPA 라우트 변경 시 GA4 페이지뷰 이벤트 전송
 * 프로세스 설명: useLocation으로 pathname 감지 → 변경 시 GA4 pageview 이벤트 전송
 */
import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import ReactGA from "react-ga4";

const Ga4PageViewTracker = () => {
  const { pathname, search } = useLocation();

  useEffect(() => {
    ReactGA.send({
      hitType: "pageview",
      page: pathname + search,
      title: document.title,
    });
  }, [pathname, search]);

  return null;
};

export default Ga4PageViewTracker;
