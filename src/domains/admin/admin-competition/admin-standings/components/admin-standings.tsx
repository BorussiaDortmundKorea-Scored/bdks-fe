/**
 * 작성자: KYD
 * 기능: 리그 순위 관리 (PagedCard 순위표 + 순위 갱신 버튼)
 * 프로세스 설명: get_standings로 대회별 순위를 표시하고, 갱신 버튼으로 update-standings Edge Function을 호출해
 *              football-data.org 최신 순위를 적재 후 재조회한다. 도르트문트 행은 강조.
 */
import { useState } from "react";

import { useQueryClient } from "@tanstack/react-query";
import { PagedCard } from "@youngduck/yd-ui/Cards";
import { useOverlay } from "@youngduck/yd-ui/Overlays";
import { Col, ColGroup, TBody, THead, Table, Td, Th, Tr } from "@youngduck/yd-ui/Table";
import { ListOrdered } from "lucide-react";

import { type IStanding } from "@admin/admin-competition/admin-standings/api/admin-standings-api";
import { ADMIN_STANDINGS_QUERY_KEYS } from "@admin/admin-competition/admin-standings/api/react-query-api/admin-standings-query-keys";
import { useGetStandingsSuspense } from "@admin/admin-competition/admin-standings/api/react-query-api/use-get-standings";

import { supabase } from "@shared/api/config/supabaseClient";

interface IUpdateStandingsResult {
  results?: { competition: string; ok: boolean; count?: number }[];
}

const PAGES = [
  { code: "BL1", label: "분데스리가" },
  { code: "CL", label: "챔피언스리그" },
] as const;

const StandingTable = ({ rows }: { rows: IStanding[] }) => {
  if (rows.length === 0) {
    return <p className="text-yds-c1m text-primary-100 py-4 text-center">순위 데이터가 없습니다.</p>;
  }

  return (
    <Table scrollable className="md:w-full" scrollClassName="h-[360px] w-full">
      <ColGroup>
        <Col className="w-[72px]" />
        <Col className="w-auto" />
        <Col className="w-[80px]" />
        <Col className="w-[64px]" />
        <Col className="w-[64px]" />
        <Col className="w-[64px]" />
        <Col className="w-[88px]" />
        <Col className="w-[80px]" />
      </ColGroup>
      <THead>
        <Tr>
          <Th>순위</Th>
          <Th>팀</Th>
          <Th className="text-right!">경기</Th>
          <Th className="text-right!">승</Th>
          <Th className="text-right!">무</Th>
          <Th className="text-right!">패</Th>
          <Th className="text-right!">득실</Th>
          <Th className="text-right!">승점</Th>
        </Tr>
      </THead>
      <TBody>
        {rows.map((row) => {
          // 도르트문트 강조 + 숫자 컬럼 우측정렬 (yds-table-cell override는 important)
          const highlight = row.is_our_team ? "text-yellow-500 font-bold" : "";
          const numeric = `${highlight} text-right!`.trim();
          return (
            <Tr key={row.fd_team_id ?? row.position}>
              <Td className={highlight}>{row.position}</Td>
              <Td className={highlight}>{row.team_name}</Td>
              <Td className={numeric}>{row.played}</Td>
              <Td className={numeric}>{row.won}</Td>
              <Td className={numeric}>{row.draw}</Td>
              <Td className={numeric}>{row.lost}</Td>
              <Td className={numeric}>
                {row.goal_difference > 0 ? "+" : ""}
                {row.goal_difference}
              </Td>
              <Td className={numeric}>{row.points}</Td>
            </Tr>
          );
        })}
      </TBody>
    </Table>
  );
};

const AdminStandings = () => {
  //SECTION HOOK호출 영역
  const bundesliga = useGetStandingsSuspense("BL1");
  const championsLeague = useGetStandingsSuspense("CL");
  const overlay = useOverlay();
  const queryClient = useQueryClient();
  //!SECTION HOOK호출 영역

  //SECTION 상태값 영역
  const [isUpdating, setIsUpdating] = useState(false);
  const rowsByCode: Record<string, IStanding[]> = { BL1: bundesliga, CL: championsLeague };
  //!SECTION 상태값 영역

  //SECTION 메서드 영역
  const handleUpdateStandings = async () => {
    if (isUpdating) return;
    setIsUpdating(true);
    try {
      const { data, error } = await supabase.functions.invoke<IUpdateStandingsResult>("update-standings");
      if (error) throw error;

      const ok = (data?.results ?? []).filter((result) => result.ok);
      overlay.toast({ content: ok.length ? "순위 갱신을 성공했어요" : "갱신된 순위가 없어요" });
      await queryClient.invalidateQueries({ queryKey: [ADMIN_STANDINGS_QUERY_KEYS.STANDINGS] });
    } catch {
      overlay.toast({ content: "순위 갱신에 실패했어요" });
    } finally {
      setIsUpdating(false);
    }
  };
  //!SECTION 메서드 영역

  return (
    <div className="flex h-full w-full flex-col">
      {/* 헤더 */}
      <div className="flex w-full items-center justify-between p-4">
        <h2 className="text-yds-s1 text-primary-100">리그 순위</h2>
        <button
          type="button"
          onClick={handleUpdateStandings}
          disabled={isUpdating}
          className="text-primary-100 hover:bg-primary-100/20 flex cursor-pointer items-center justify-center rounded-md p-2 transition-colors hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
          aria-label="리그 순위 갱신"
          title="리그 순위 갱신"
        >
          <ListOrdered size={20} className={isUpdating ? "animate-pulse" : ""} />
        </button>
      </div>

      <PagedCard variant="outlined" className="w-full">
        <PagedCard.Header>이번 시즌 리그 순위</PagedCard.Header>
        {PAGES.map((page) => (
          <PagedCard.Page key={page.code}>
            <div className="flex flex-col gap-2">
              <span className="text-yds-c1m text-primary-100">{page.label}</span>
              <StandingTable rows={rowsByCode[page.code]} />
            </div>
          </PagedCard.Page>
        ))}
      </PagedCard>
    </div>
  );
};

export default AdminStandings;
