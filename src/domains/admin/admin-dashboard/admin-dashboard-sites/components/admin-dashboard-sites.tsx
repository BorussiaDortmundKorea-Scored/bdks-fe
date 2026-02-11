/**
 * 작성자: KYD
 * 기능: 관리자 대시보드 - 홈 이동 + 사이트 링크, 가로 스크롤(휠)
 * 프로세스 설명: SITE_LINK_DATA 기준으로 한 줄 배치, internalPath는 내부 이동, link는 외부 링크. 가로 넘침 시 휠로 가로 스크롤
 */
import { useRef } from "react";
import { useNavigate } from "react-router-dom";

import { SITE_LINK_DATA } from "../constants/site-link-data";
import AdminDashboardSitesWrapper from "./wrapper/admin-dashboard-sites-wrapper";

const LINK_BUTTON_CLASS =
  "cursor-pointer shrink-0 focus:outline-none";

const AdminDashboardSites = () => {
  const navigate = useNavigate();
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const handleWheel: React.WheelEventHandler<HTMLDivElement> = (event) => {
    const container = scrollContainerRef.current;
    if (!container) return;
    const canScrollHorizontally = container.scrollWidth > container.clientWidth;
    if (!canScrollHorizontally) return;
    container.scrollLeft += event.deltaY;
  };

  return (
    <AdminDashboardSitesWrapper>
      <div
        ref={scrollContainerRef}
        onWheel={handleWheel}
        className="scrollbar-hide-x flex w-full flex-row items-center gap-4 overflow-x-auto overflow-y-hidden select-none"
      >
        {SITE_LINK_DATA.map((item) => {
          const isInternal = "internalPath" in item && item.internalPath;
          if (isInternal) {
            return (
              <button
                type="button"
                key={item.id}
                onClick={() => navigate(item.internalPath)}
                title="홈으로 이동"
                aria-label="대시보드 홈으로 이동"
                className={`text-primary-100 font-shilla-culture flex h-12 w-12 shrink-0 flex-col items-center justify-center gap-1 sm:h-9 sm:w-9 md:h-10 md:w-10 ${LINK_BUTTON_CLASS}`}
              >
                <img src={item.logo} alt="BDKS Logo" className="h-full w-full object-contain" />
              </button>
            );
          }
          return (
            <a
              href={item.link}
              target="_blank"
              rel="noopener noreferrer"
              key={item.id}
              title={`${item.name} 열기`}
              aria-label={`${item.name} 새 탭에서 열기`}
              className={`sm:h-9 sm:w-9 md:h-10 md:w-10 ${LINK_BUTTON_CLASS}`}
            >
              <img src={item.logo} alt="" className="h-full w-full" />
            </a>
          );
        })}
      </div>
    </AdminDashboardSitesWrapper>
  );
};

export default AdminDashboardSites;
