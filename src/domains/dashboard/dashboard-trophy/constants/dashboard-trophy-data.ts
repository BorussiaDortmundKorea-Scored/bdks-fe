/**
 * 작성자: KYD
 * 기능: 보루시아 도르트문트 우승 트로피 데이터 (실제 기록)
 */
export interface ITrophy {
  id: string;
  name: string;
  count: number;
  /** Supabase Storage 트로피 이미지 파일명 (dortmund/trophy/) */
  file: string;
  /** 우승 연도 (hover 툴팁 노출용) */
  years: string;
}

export const TROPHIES: ITrophy[] = [
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
