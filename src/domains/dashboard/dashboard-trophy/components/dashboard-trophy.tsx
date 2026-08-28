/**
 * 작성자: KYD
 * 기능: 구단 우승 트로피 진열 (선수 DB와 동일한 가로 스크롤 UI)
 * 프로세스 설명: TROPHIES 데이터를 Supabase Storage 이미지와 함께 가로 스크롤로 노출한다.
 */
import { HorizonDragScroll } from "@youngduck/yd-ui/HorizonDragScroll";

import { TROPHIES } from "@dashboard/dashboard-trophy/constants/dashboard-trophy-data";

import { DORTMUND_TROPHY_BASE } from "@shared/constants/supabse-storage";

const DashboardTrophy = () => {
  return (
    <section className="text-primary-100 w-full">
      <h2 className="text-yds-s2 mb-4">우승 기록</h2>
      {/* 가로 스크롤 컨테이너 (선수 평점과 동일 패턴) */}
      <HorizonDragScroll as="ul" className="w-full gap-3">
        {TROPHIES.map((trophy) => (
          <li key={trophy.id} className="w-[92px] shrink-0" title={`${trophy.name} 우승: ${trophy.years}`}>
            <div className="flex w-full flex-col items-center gap-2">
              <img
                src={`${DORTMUND_TROPHY_BASE}/${trophy.file}`}
                alt={`${trophy.name} 트로피`}
                loading="lazy"
                className="h-[72px] w-[72px] object-contain"
              />
              <div className="flex flex-col items-center gap-[2px]">
                <span className="text-yds-c1r text-center text-white">{trophy.name}</span>
                <span className="text-primary-100 text-yds-c1m font-bold">×{trophy.count}</span>
              </div>
            </div>
          </li>
        ))}
      </HorizonDragScroll>
    </section>
  );
};

export default DashboardTrophy;
