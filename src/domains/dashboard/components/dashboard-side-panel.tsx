/**
 * 작성자: KYD
 * 기능: (실험) 넓은 대시보드 우측 사이드 카드 패널
 * 프로세스 설명: ① 구단 우승 트로피 진열(실제 기록) ② Top 선수
 */
import { HorizonDragScroll } from "@youngduck/yd-ui/HorizonDragScroll";

import DashboardTopPlayers from "@dashboard/dashboard-top-players/components/dashboard-top-players";
import DashboardTopPlayersErrorFallback from "@dashboard/dashboard-top-players/components/error/dashboard-top-players-error-fallback";
import DashboardTopPlayersSkeleton from "@dashboard/dashboard-top-players/components/skeleton/dashboard-top-players-skeleton";

import { DORTMUND_TROPHY_BASE } from "@shared/constants/supabse-storage";
import ReactQueryBoundary from "@shared/provider/react-query-boundary";

//SECTION 트로피 (보루시아 도르트문트 실제 우승 기록)
interface ITrophy {
  id: string;
  name: string;
  count: number;
  /** Supabase Storage 트로피 이미지 파일명 (dortmund/trophy/) */
  file: string;
  /** 우승 연도 (hover 툴팁 노출용) */
  years: string;
}

const TROPHIES: ITrophy[] = [
  {
    id: "bundesliga",
    name: "분데스리가",
    count: 8,
    file: "meisterschale.png",
    years: "1955-56, 1956-57, 1962-63, 1994-95, 1995-96, 2001-02, 2010-11, 2011-12",
  },
  {
    id: "dfb-pokal",
    name: "DFB-포칼",
    count: 5,
    file: "dfb_pokal_cup.png",
    years: "1964-65, 1988-89, 2011-12, 2016-17, 2020-21",
  },
  {
    id: "dfl-supercup",
    name: "DFL-슈퍼컵",
    count: 6,
    file: "german_super_cup.png",
    years: "1989, 1995, 1996, 2013, 2014, 2019",
  },
  { id: "ucl", name: "챔피언스리그", count: 1, file: "champions_league.png", years: "1996-97" },
  { id: "cup-winners", name: "UEFA 컵위너스컵", count: 1, file: "winners_cup.png", years: "1965-66" },
  { id: "intercontinental", name: "인터콘티넨털컵", count: 1, file: "intercontinental_cup.png", years: "1997" },
];
//!SECTION 트로피

const TrophyShowcase = () => {
  return (
    <section className="text-primary-100 w-full">
      <h2 className="text-yds-s2 mb-4">우승 기록</h2>
      {/* 가로 스크롤 컨테이너 (선수 DB와 동일 패턴) */}
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

const DashboardSidePanel = () => {
  return (
    <aside className="flex w-full flex-col gap-6">
      <TrophyShowcase />

      <ReactQueryBoundary skeleton={<DashboardTopPlayersSkeleton />} errorFallback={DashboardTopPlayersErrorFallback}>
        <DashboardTopPlayers />
      </ReactQueryBoundary>
    </aside>
  );
};

export default DashboardSidePanel;
