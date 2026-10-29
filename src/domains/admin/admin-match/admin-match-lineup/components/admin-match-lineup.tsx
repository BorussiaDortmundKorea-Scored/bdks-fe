/**
 * 작성자: KYD
 * 기능: 경기 라인업 관리 컴포넌트
 * 프로세스 설명: 기본은 포메이션 보드에서 선발 배치·경기 기록을 입력하고, 표 탭에서 전체 기록을 보거나 정정한다.
 *              우측 상단에는 보드|표 전환만 둔다. (선발은 보드의 빈 자리, 후보는 보드 "교체" 화면의 + 칸으로 넣는다)
 */
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { Tabs } from "@youngduck/yd-ui";
import { ArrowLeft } from "lucide-react";

import { useGetMatchLineupsSuspense } from "@admin/admin-match/admin-match-lineup/api/react-query-api/use-get-match-lineups-suspense";
import AdminMatchLineupBoard from "@admin/admin-match/admin-match-lineup/components/board/admin-match-lineup-board";
import AdminMatchLineupTable from "@admin/admin-match/admin-match-lineup/components/table/admin-match-lineup-table";
import { useGetAllMatchesSuspense } from "@admin/admin-match/api/react-query-api/use-get-all-matches-suspense";

import { ROUTES } from "@shared/constants/routes";

//SECTION 리렌더링이 불필요한영역: 매직넘버, 문자열, 상수
const VIEW_TABS = [
  { label: "보드", value: "board" },
  { label: "표", value: "table" },
];
//!SECTION 리렌더링이 불필요한영역: 매직넘버, 문자열, 상수

const AdminMatchLineup = () => {
  //SECTION HOOK호출 영역
  const navigate = useNavigate();
  const { matchId } = useParams<{ matchId: string }>();

  if (!matchId) {
    throw new Error("Match ID is required");
  }

  // 보드·표가 같은 쿼리를 쓰므로 여기서 먼저 불러 Suspense 경계를 페이지 하나로 모은다
  useGetMatchLineupsSuspense(matchId);
  const { data: matches } = useGetAllMatchesSuspense();
  //!SECTION HOOK호출 영역

  //SECTION 상태값 영역
  const [view, setView] = useState("board");
  // 보드 헤더의 경기정보와 포메이션으로 쓴다
  const match = matches.find((item) => item.id === matchId);
  //!SECTION 상태값 영역

  //SECTION 메서드 영역
  const handleBackToMatchList = () => {
    navigate(ROUTES.ADMIN_MATCH);
  };

  //!SECTION 메서드 영역

  return (
    <div className="flex h-full w-full flex-col">
      {/* 헤더 */}
      <div className="flex w-full items-center justify-between p-4">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleBackToMatchList}
            className="text-primary-100 flex h-8 w-8 items-center justify-center"
            aria-label="경기 목록으로 이동"
          >
            <ArrowLeft size={24} />
          </button>
          <h2 className="text-yds-s1 text-primary-100">라인업 관리</h2>
        </div>
        <Tabs options={VIEW_TABS} value={view} onValueChange={setView} size="sm" />
      </div>

      <div className="px-4">
        {view === "board" ? (
          <AdminMatchLineupBoard matchId={matchId} match={match} />
        ) : (
          <AdminMatchLineupTable matchId={matchId} />
        )}
      </div>
    </div>
  );
};

export default AdminMatchLineup;
