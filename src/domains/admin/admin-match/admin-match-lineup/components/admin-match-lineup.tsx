/**
 * 작성자: KYD
 * 기능: 경기 라인업 관리 컴포넌트 - 라인업 CRUD 기능
 * 프로세스 설명: 특정 경기의 라인업 목록 조회, 생성, 수정, 삭제 기능 제공
 */
import { useParams } from "react-router-dom";

import { Button } from "@youngduck/yd-ui";
import { useOverlay } from "@youngduck/yd-ui/Overlays";
import { TBody, THead, Table, Td, Th, Tr } from "@youngduck/yd-ui/Table";
import { ArrowLeftRight, Edit, FolderPlus, Star, Trash2 } from "lucide-react";

import type { IMatchLineup } from "@admin/admin-match/admin-match-lineup/api/admin-match-lineup-api";
import { useDeleteMatchLineup } from "@admin/admin-match/admin-match-lineup/api/react-query-api/use-delete-match-lineup";
import { useGetMatchLineupsSuspense } from "@admin/admin-match/admin-match-lineup/api/react-query-api/use-get-match-lineups-suspense";
import { AdminMatchLineupAddModal } from "@admin/admin-match/admin-match-lineup/components/modal/admin-match-lineup-add-modal";
import { AdminMatchLineupBulkAddModal } from "@admin/admin-match/admin-match-lineup/components/modal/admin-match-lineup-bulk-add-modal";
import { AdminMatchLineupEditModal } from "@admin/admin-match/admin-match-lineup/components/modal/admin-match-lineup-edit-modal";
import { AdminMatchLineupSubstitutionModal } from "@admin/admin-match/admin-match-lineup/components/modal/admin-match-lineup-substitution-modal";

const AdminMatchLineup = () => {
  //SECTION HOOK호출 영역
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
  const handleDeleteLineup = async (id: number) => {
    if (!confirm("정말로 이 라인업을 삭제하시겠습니까?")) return;

    await deleteLineup(id);
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

  const handleOpenSubstitutionModal = (lineup: IMatchLineup) => {
    if (lineup.lineup_type !== "STARTING") return;
    overlay.modalOpen({
      content: (onClose) => <AdminMatchLineupSubstitutionModal matchId={matchId} lineup={lineup} onClose={onClose} />,
      config: { size: "sm" },
    });
  };

  const getLineupTypeText = (type: string) => {
    return type === "STARTING" ? "선발" : "벤치";
  };

  const getSubstitutionStatusText = (status: string) => {
    switch (status) {
      case "IN":
        return "교체투입";
      case "OUT":
        return "교체아웃";
      case "SUBSTITUTED_IN":
        return "교체투입";
      case "SUBSTITUTED_OUT":
        return "교체아웃";
      default:
        return "없음";
    }
  };
  //!SECTION 메서드 영역

  return (
    <div className="flex h-full w-full flex-col">
      {/* 헤더 */}
      <div className="flex w-full items-center justify-between p-4">
        <h2 className="text-yds-s1 text-primary-100">라인업 관리</h2>
        <div className="flex items-center gap-2">
          <Button
            variant="outlined"
            color="primary"
            size="lg"
            onClick={handleOpenBulkAddModal}
            className="flex items-center gap-2"
            aria-label="스타팅 명단등록"
          >
            <FolderPlus size={20} />
            스타팅 명단등록
          </Button>
          <Button
            variant="outlined"
            color="primary"
            size="md"
            onClick={handleOpenAddModal}
            className="flex items-center gap-2"
            aria-label="새 라인업 추가"
          >
            <FolderPlus size={20} />
            선수 추가
          </Button>
        </div>
      </div>

      {/* 스크롤 가능한 컨텐츠 영역 */}
      <Table scrollable={true} className="md:w-full" scrollClassName="h-[760px] w-full">
        <THead>
          <Tr>
            <Th>선수명</Th>
            <Th>포지션</Th>
            <Th>라인업</Th>
            <Th>주장</Th>
            <Th>교체</Th>
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
                {getSubstitutionStatusText(lineup.substitution_status)}
                {lineup.substitution_minute && ` (${lineup.substitution_minute}')`}
              </Td>
              <Td className="whitespace-nowrap">
                {lineup.goals}골 / {lineup.assists}어시
              </Td>
              <Td className="whitespace-nowrap">
                {lineup.yellow_cards > 0 && <span className="text-yellow-500">{lineup.yellow_cards}장</span>}
                {lineup.is_sent_off && <span className="ml-2 text-red-500">퇴장</span>}
              </Td>
              <Td className="whitespace-nowrap">
                <div className="flex items-center gap-3">
                  {lineup.lineup_type === "STARTING" && (
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
