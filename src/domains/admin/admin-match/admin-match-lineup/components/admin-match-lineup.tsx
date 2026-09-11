/**
 * 작성자: KYD
 * 기능: 경기 라인업 관리 컴포넌트 - 라인업 CRUD 기능
 * 프로세스 설명: 특정 경기의 라인업 목록 조회, 생성, 수정, 삭제 기능 제공
 */
import { useNavigate, useParams } from "react-router-dom";

import { useOverlay } from "@youngduck/yd-ui/Overlays";
import { Col, ColGroup, TBody, THead, Table, Td, Th, Tr } from "@youngduck/yd-ui/Table";
import { ArrowLeft, ArrowLeftRight, Edit, Star, Trash2, UserPlus, Users } from "lucide-react";

import type { IMatchLineup } from "@admin/admin-match/admin-match-lineup/api/admin-match-lineup-api";
import { useDeleteMatchLineup } from "@admin/admin-match/admin-match-lineup/api/react-query-api/use-delete-match-lineup";
import { useGetMatchLineupsSuspense } from "@admin/admin-match/admin-match-lineup/api/react-query-api/use-get-match-lineups-suspense";
import { AdminMatchLineupAddModal } from "@admin/admin-match/admin-match-lineup/components/modal/admin-match-lineup-add-modal";
import { AdminMatchLineupBulkAddModal } from "@admin/admin-match/admin-match-lineup/components/modal/admin-match-lineup-bulk-add-modal";
import { AdminMatchLineupEditModal } from "@admin/admin-match/admin-match-lineup/components/modal/admin-match-lineup-edit-modal";
import { AdminMatchLineupSubstitutionModal } from "@admin/admin-match/admin-match-lineup/components/modal/admin-match-lineup-substitution-modal";

import { ROUTES } from "@shared/constants/routes";

const AdminMatchLineup = () => {
  //SECTION HOOK호출 영역
  const navigate = useNavigate();
  const { matchId } = useParams<{ matchId: string }>();

  if (!matchId) {
    throw new Error("Match ID is required");
  }

  const { data: lineups } = useGetMatchLineupsSuspense(matchId);
  const { mutateAsync: deleteLineup } = useDeleteMatchLineup(matchId);
  const overlay = useOverlay();
  //!SECTION HOOK호출 영역

  //SECTION 상태값 영역

  //!SECTION 상태값 영역

  //SECTION 메서드 영역
  const handleBackToMatchList = () => {
    navigate(ROUTES.ADMIN_MATCH);
  };

  const handleDeleteLineup = (id: number) => {
    overlay.confirmDialog({
      title: "정말로 이 라인업을 삭제하시겠습니까?",
      onConfirm: async () => {
        await deleteLineup(id);
      },
    });
  };

  const handleOpenAddModal = () => {
    overlay.modalOpen({
      content: (onClose) => <AdminMatchLineupAddModal matchId={matchId} onClose={onClose} />,
      config: { size: "sm" },
    });
  };

  const handleOpenBulkAddModal = () => {
    overlay.modalOpen({
      content: (onClose) => <AdminMatchLineupBulkAddModal matchId={matchId} onClose={onClose} />,
      config: { size: "sm" },
    });
  };

  const handleOpenEditModal = (lineup: IMatchLineup) => {
    overlay.modalOpen({
      content: (onClose) => <AdminMatchLineupEditModal matchId={matchId} lineup={lineup} onClose={onClose} />,
      config: { size: "sm" },
    });
  };

  // 현재 그라운드에 있는 선수만 교체 아웃될 수 있다 (선발이거나, 이미 교체 투입된 선수)
  const isOnPitch = (lineup: IMatchLineup) =>
    (lineup.lineup_type === "STARTING" || lineup.sub_in_minute !== null) && lineup.sub_out_minute === null;

  const handleOpenSubstitutionModal = (lineup: IMatchLineup) => {
    if (!isOnPitch(lineup)) return;
    overlay.modalOpen({
      content: (onClose) => <AdminMatchLineupSubstitutionModal matchId={matchId} lineup={lineup} onClose={onClose} />,
      config: { size: "sm" },
    });
  };

  const getLineupTypeText = (type: string) => {
    return type === "STARTING" ? "선발" : "벤치";
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
        {/* 액션: 아이콘 버튼 (스타팅 명단등록 / 선수 추가) */}
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={handleOpenBulkAddModal}
            className="text-primary-100 hover:bg-primary-100/20 flex cursor-pointer items-center justify-center rounded-md p-2 transition-colors hover:text-white"
            aria-label="스타팅 명단등록"
            title="스타팅 명단등록"
          >
            <Users size={20} />
          </button>
          <button
            type="button"
            onClick={handleOpenAddModal}
            className="text-primary-100 hover:bg-primary-100/20 flex cursor-pointer items-center justify-center rounded-md p-2 transition-colors hover:text-white"
            aria-label="새 라인업 추가"
            title="선수 추가"
          >
            <UserPlus size={20} />
          </button>
        </div>
      </div>

      {/* 스크롤 가능한 컨텐츠 영역 */}
      <Table scrollable={true} className="md:w-full" scrollClassName="h-[760px] w-full md:w-[911px]">
        <ColGroup>
          <Col className="w-[120px]" />
          <Col className="w-[100px]" />
          <Col className="w-[80px]" />
          <Col className="w-[60px]" />
          <Col className="w-[120px]" />
          <Col className="w-[100px]" />
          <Col className="w-[100px]" />
          <Col className="w-[120px]" />
        </ColGroup>
        <THead>
          <Tr>
            <Th sortable>선수명</Th>
            <Th sortable>포지션</Th>
            <Th sortable>라인업</Th>
            <Th>주장</Th>
            <Th sortable>교체</Th>
            <Th>골/어시</Th>
            <Th>카드</Th>
            <Th>작업</Th>
          </Tr>
        </THead>
        <TBody>
          {lineups.map((lineup) => (
            <Tr key={lineup.id}>
              <Td className="whitespace-nowrap">{lineup.player_korean_name || lineup.player_name}</Td>
              <Td className="whitespace-nowrap">{lineup.position_detail_name || "-"}</Td>
              <Td className="whitespace-nowrap">{getLineupTypeText(lineup.lineup_type)}</Td>
              <Td className="whitespace-nowrap">
                {lineup.is_captain && <Star size={16} className="text-yellow-500" />}
              </Td>
              <Td className="whitespace-nowrap">
                <SubstitutionCell lineup={lineup} />
              </Td>
              <Td className="whitespace-nowrap">
                {lineup.goals}골 / {lineup.assists}어시
              </Td>
              <Td className="whitespace-nowrap">
                {(lineup.yellow_cards ?? 0) > 0 && <span className="text-yellow-500">{lineup.yellow_cards}장</span>}
                {lineup.is_sent_off && <span className="ml-2 text-red-500">퇴장</span>}
              </Td>
              <Td className="whitespace-nowrap">
                <div className="flex items-center gap-3">
                  {isOnPitch(lineup) && (
                    <button
                      onClick={() => handleOpenSubstitutionModal(lineup)}
                      className="text-primary-100 hover:bg-primary-100/20 cursor-pointer rounded-md p-1 transition-colors hover:text-white"
                      aria-label="교체"
                    >
                      <ArrowLeftRight size={16} />
                    </button>
                  )}
                  <button
                    onClick={() => handleOpenEditModal(lineup)}
                    className="text-primary-100 hover:bg-primary-100/20 cursor-pointer rounded-md p-1 transition-colors hover:text-white"
                    aria-label="수정"
                  >
                    <Edit size={16} />
                  </button>
                  <button
                    onClick={() => handleDeleteLineup(lineup.id)}
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

export default AdminMatchLineup;

/** 한 선수의 교체 투입/아웃 두 시점을 함께 보여준다 */
const SubstitutionCell = ({ lineup }: { lineup: IMatchLineup }) => {
  const hasSubIn = lineup.sub_in_minute !== null;
  const hasSubOut = lineup.sub_out_minute !== null;

  if (!hasSubIn && !hasSubOut) return <span>없음</span>;

  return (
    <div className="flex flex-col gap-0.5">
      {hasSubIn && (
        <span className="text-green-400">
          IN {lineup.sub_in_minute}'{lineup.sub_in_partner_name && ` (${lineup.sub_in_partner_name})`}
        </span>
      )}
      {hasSubOut && (
        <span className="text-red-400">
          OUT {lineup.sub_out_minute}'{lineup.sub_out_partner_name && ` (${lineup.sub_out_partner_name})`}
        </span>
      )}
    </div>
  );
};
