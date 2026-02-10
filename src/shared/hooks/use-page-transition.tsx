import { useRef } from "react";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";

export const usePageTransition = () => {
  const pageRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (pageRef.current) {
        // 페이지 진입 애니메이션
        gsap.fromTo(
          pageRef.current,
          {
            opacity: 0,
            y: 0,
            scale: 0.95,
          },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.6,
            ease: "power2.out",
          },
        );
      }

      //  언마운트 관련 클린업은 gsap에서 알아서 처리중.
    },
    { scope: pageRef },
  );

  return { pageRef };
};
