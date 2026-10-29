/**
 * 작성자: KYD
 * 기능: 경기 라인업 표 (라인업 관리의 "표" 탭)
 * 프로세스 설명: 입력은 보드 탭에서 하고, 표는 전체 기록을 한눈에 보거나 정정할 때 쓴다.
 *              행마다 교체·수정·삭제를 그대로 둔다. (보드 도입 전 라인업 관리 화면의 표를 옮겨 왔다)
 */
import { useOverlay } from "@youngduck/yd-ui/Overlays";
import { Col, ColGroup, TBody, THead, Table, Td, Th, Tr } from "@youngduck/yd-ui/Table";
import { ArrowLeftRight, Edit, Star, Trash2 } from "lucide-react";

import type { IMatchLineup } from "@admin/admin-match/admin-match-lineup/api/admin-match-lineup-api";
import { useDeleteMatchLineup } from "@admin/admin-match/admin-match-lineup/api/react-query-api/use-delete-match-lineup";
import { useGetMatchLineupsSuspense } from "@admin/admin-match/admin-match-lineup/api/react-query-api/use-get-match-lineups-suspense";
import { AdminMatchLineupEditModal } from "@admin/admin-match/admin-match-lineup/components/modal/admin-match-lineup-edit-modal";
import { AdminMatchLineupSubstitutionModal } from "@admin/admin-match/admin-match-lineup/components/modal/admin-match-lineup-substitution-modal";
import { isOnPitch } from "@admin/admin-match/admin-match-lineup/utils/lineup-board-utils";

import { MODAL_SLOT_CONFIG } from "@shared/components/modal/modal-slot-config";

const AdminMatchLineupTable = ({ matchId }: { matchId: string }) => {
  //SECTION HOOK호출 영역
  const { data: lineups } = useGetMatchLineupsSuspense(matchId);
  const { mutateAsync: deleteLineup } = useDeleteMatchLineup(matchId);
  const overlay = useOverlay();
  //!SECTION HOOK호출 영역

  //SECTION 메서드 영역
  const handleDeleteLineup = (id: number) => {
    overlay.confirmDialog({
      title: "정말로 이 라인업을 삭제하시겠습니까?",
      onConfirm: async () => {
        await deleteLineup(id);
      },
    });
  };

  const handleOpenEditModal = (lineup: IMatchLineup) => {
    overlay.modalOpen({
      content: (onClose) => <AdminMatchLineupEditModal matchId={matchId} lineup={lineup} onClose={onClose} />,
      config: { size: "sm", ...MODAL_SLOT_CONFIG },
    });
  };

  const handleOpenSubstitutionModal = (lineup: IMatchLineup) => {
    if (!isOnPitch(lineup)) return;
    overlay.modalOpen({
      content: (onClose) => <AdminMatchLineupSubstitutionModal matchId={matchId} lineup={lineup} onClose={onClose} />,
      config: { size: "sm", ...MODAL_SLOT_CONFIG },
    });
  };

  const getLineupTypeText = (type: string) => {
    return type === "STARTING" ? "선발" : "벤치";
  };
  //!SECTION 메서드 영역

  return (
    <Table scrollable={true} className="xl:w-full" scrollClassName="h-[760px] w-full xl:w-[911px]">
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
            <Td className="whitespace-nowrap">{lineup.is_captain && <Star size={16} className="text-yellow-500" />}</Td>
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
  );
};

export default AdminMatchLineupTable;

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
