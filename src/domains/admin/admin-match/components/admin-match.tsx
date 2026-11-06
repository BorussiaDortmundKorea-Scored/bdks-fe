/**
 * 작성자: KYD
 * 기능: 경기 관리 컴포넌트 - 경기 CRUD 기능
 * 프로세스 설명: 경기 목록 조회, 생성, 수정, 삭제 기능 제공 및 라인업 관리 접근
 */
import { useMemo } from "react";
import { useNavigate } from "react-router-dom";

import { Chips, Tabs } from "@youngduck/yd-ui";
import { HorizonDragScroll } from "@youngduck/yd-ui/HorizonDragScroll";
import { useOverlay } from "@youngduck/yd-ui/Overlays";
import { Col, ColGroup, TBody, THead, Table, Td, Th, Tr } from "@youngduck/yd-ui/Table";
import { Edit, ListPlus, Plus, Trash2, Users } from "lucide-react";

import type { IMatch } from "@admin/admin-match/api/admin-match-api";
import { useDeleteMatch } from "@admin/admin-match/api/react-query-api/use-delete-match";
import { useGetAllMatchesSuspense } from "@admin/admin-match/api/react-query-api/use-get-all-matches-suspense";
import { AdminMatchAddModal } from "@admin/admin-match/components/modal/admin-match-add-modal";
import { AdminMatchBulkAddModal } from "@admin/admin-match/components/modal/admin-match-bulk-add-modal";
import { AdminMatchEditModal } from "@admin/admin-match/components/modal/admin-match-edit-modal";
import { useMatchViewFilter } from "@admin/admin-match/hooks/use-match-view-filter";
import { convertUTCToLocal } from "@admin/admin-match/utils/datetime-utils";
import {
  type MatchViewFilter,
  filterMatches,
  getTodayKST,
  isMatchViewFilter,
  sortMatchesByUpcoming,
} from "@admin/admin-match/utils/sort-matches-by-upcoming";

import { MODAL_SLOT_CONFIG } from "@shared/components/modal/modal-slot-config";
import { createAdminMatchLineupPath } from "@shared/constants/routes";

const VIEW_FILTER_OPTIONS: { label: string; value: MatchViewFilter }[] = [
  { label: "예정", value: "upcoming" },
  { label: "라이브", value: "live" },
  { label: "지난 경기", value: "past" },
  { label: "전체", value: "all" },
];

const AdminMatch = () => {
  //SECTION HOOK호출 영역
  const navigate = useNavigate();
  const { data: matches } = useGetAllMatchesSuspense();
  const { mutateAsync: deleteMatch } = useDeleteMatch();
  const overlay = useOverlay();
  const [view, setView] = useMatchViewFilter();
  //!SECTION HOOK호출 영역

  //SECTION 상태값 영역
  // 시즌 전체 일정이 들어 있어 다가오는 경기부터 보이게 한다 (지난 경기는 그 아래 최근 순)
  const todayKST = getTodayKST();
  const filteredMatches = useMemo(() => filterMatches(matches, todayKST, view), [matches, todayKST, view]);
  const sortedMatches = useMemo(() => sortMatchesByUpcoming(filteredMatches, todayKST), [filteredMatches, todayKST]);
  //!SECTION 상태값 영역

  //SECTION 메서드 영역
  const handleDeleteMatch = (id: string) => {
    overlay.confirmDialog({
      title: "정말로 이 경기를 삭제하시겠습니까?",
      onConfirm: async () => {
        await deleteMatch(id);
      },
    });
  };

  const handleOpenAddModal = () => {
    overlay.modalOpen({
      content: (onClose) => <AdminMatchAddModal onClose={onClose} />,
      config: { size: "sm", ...MODAL_SLOT_CONFIG },
    });
  };

  const handleOpenBulkAddModal = () => {
    overlay.modalOpen({
      content: (onClose) => <AdminMatchBulkAddModal onClose={onClose} />,
      config: { size: "lg", ...MODAL_SLOT_CONFIG },
    });
  };

  const handleOpenEditModal = (match: IMatch) => {
    overlay.modalOpen({
      content: (onClose) => <AdminMatchEditModal match={match} onClose={onClose} />,
      config: { size: "sm", ...MODAL_SLOT_CONFIG },
    });
  };

  const handleLineupManagement = (matchId: string) => {
    navigate(createAdminMatchLineupPath(matchId));
  };
  //!SECTION 메서드 영역

  return (
    <div className="flex h-full w-full flex-col">
      {/* 헤더: 제목 | 필터(가로 드래그 스크롤) | 버튼 을 모바일·PC 모두 한 줄로. 폭이 모자라면 필터 영역만 줄고 스크롤된다 */}
      <div className="flex w-full flex-nowrap items-center gap-3">
        <h2 className="text-yds-s1 text-primary-100 shrink-0 whitespace-nowrap">경기 관리</h2>
        <HorizonDragScroll className="min-w-0 flex-1">
          <Tabs
            aria-label="경기 보기 필터"
            options={VIEW_FILTER_OPTIONS}
            value={view}
            onValueChange={(value: string) => {
              if (isMatchViewFilter(value)) setView(value);
            }}
            size="md"
            className="shrink-0"
          />
        </HorizonDragScroll>
        <div className="flex shrink-0 items-center gap-2">
          <button
            type="button"
            onClick={handleOpenAddModal}
            className="text-primary-100 hover:bg-primary-100/20 flex cursor-pointer items-center justify-center rounded-md p-2 transition-colors hover:text-white"
            aria-label="새 경기 추가"
            title="경기 추가"
          >
            <Plus size={20} />
          </button>
          <button
            type="button"
            onClick={handleOpenBulkAddModal}
            className="text-primary-100 hover:bg-primary-100/20 flex cursor-pointer items-center justify-center rounded-md p-2 transition-colors hover:text-white"
            aria-label="경기 일괄 추가"
            title="경기 일괄 추가"
          >
            <ListPlus size={20} />
          </button>
        </div>
      </div>
      {/* 스크롤 가능한 컨텐츠 영역 */}
      <Table scrollable={true} className="xl:w-[1200px]" scrollClassName="h-[760px] w-full xl:w-[911px]">
        <ColGroup>
          <Col className="w-auto" />
          <Col className="w-auto" />
          <Col className="w-auto" />
          <Col className="w-auto" />
          <Col className="w-auto" />
          <Col className="w-auto" />
          <Col className="w-auto" />
          <Col className="w-auto" />
          <Col className="w-auto" />
        </ColGroup>
        <THead>
          <Tr>
            <Th sortable>경기일</Th>
            <Th sortable>경기시간(KST)</Th>
            <Th sortable>대회</Th>
            <Th sortable>상대팀</Th>
            <Th sortable>홈/어웨이</Th>
            <Th>스코어</Th>
            <Th sortable>라운드</Th>
            <Th sortable>라이브</Th>
            <Th>작업</Th>
          </Tr>
        </THead>
        <TBody>
          {sortedMatches.map((match) => (
            <Tr key={match.id}>
              <Td>{match.match_date}</Td>
              <Td>{match.match_start_time ? convertUTCToLocal(match.match_start_time).split("T")[1] : "-"}</Td>
              <Td>{match.competition_name}</Td>
              <Td>{match.opponent_team_name}</Td>
              <Td>{match.home_away === "HOME" ? "홈" : "어웨이"}</Td>
              <Td>
                {match.our_score} : {match.opponent_score}
              </Td>
              <Td>{match.round_name}</Td>
              <Td>
                {match.is_live && (
                  <Chips variant="fill" color="primary">
                    라이브
                  </Chips>
                )}
              </Td>
              <Td>
                <div className="flex items-center gap-3">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleLineupManagement(match.id);
                    }}
                    className="cursor-pointer rounded-md p-1 text-green-500 transition-colors hover:bg-green-500/20 hover:text-white"
                    aria-label="라인업 관리"
                  >
                    <Users size={16} />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleOpenEditModal(match);
                    }}
                    className="text-primary-100 hover:bg-primary-100/20 cursor-pointer rounded-md p-1 transition-colors hover:text-white"
                    aria-label="수정"
                  >
                    <Edit size={16} />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteMatch(match.id);
                    }}
                    className="cursor-pointer rounded-md p-1 text-red-400 transition-colors hover:bg-red-500/20 hover:text-white"
                    aria-label="삭제"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </Td>
            </Tr>
          ))}
        </TBody>
      </Table>
    </div>
  );
};

export default AdminMatch;
