/**
 * 작성자: KYD
 * 기능: 경기 라인업 관리 컴포넌트 - 라인업 CRUD 기능
 * 프로세스 설명: 특정 경기의 라인업 목록 조회, 생성, 수정, 삭제 기능 제공
 */
import { useParams } from "react-router-dom";

import { Button } from "@youngduck/yd-ui";
import { useOverlay } from "@youngduck/yd-ui/Overlays";
import { ArrowLeftRight, Edit, FolderPlus, Star, Trash2 } from "lucide-react";

import type { IMatchLineup } from "@admin/admin-match/admin-match-lineup/api/admin-match-lineup-api";
import { useDeleteMatchLineup } from "@admin/admin-match/admin-match-lineup/api/react-query-api/use-delete-match-lineup";
import { useGetMatchLineupsSuspense } from "@admin/admin-match/admin-match-lineup/api/react-query-api/use-get-match-lineups-suspense";
import { AdminMatchLineupAddModal } from "@admin/admin-match/admin-match-lineup/components/modal/admin-match-lineup-add-modal";
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

      {/* 스크롤 가능한 컨텐츠 영역 */}
      <div className="scrollbar-hide border-primary-100 flex w-full flex-1 flex-col gap-4 overflow-y-auto rounded-lg border-2">
        <table className="w-full">
          <thead className="bg-background-primary text-primary-400 border-primary-100 text-yds-b1 border-b-2">
            <tr className="h-12">
              <th className="px-6 text-left uppercase">선수명</th>
              <th className="px-6 text-left uppercase">포지션</th>
              <th className="px-6 text-left uppercase">라인업</th>
              <th className="px-6 text-left uppercase">주장</th>
              <th className="px-6 text-left uppercase">교체</th>
              <th className="px-6 text-left uppercase">골/어시</th>
              <th className="px-6 text-left uppercase">카드</th>
              <th className="px-6 text-left uppercase">작업</th>
            </tr>
          </thead>
          <tbody className="bg-background-primary">
            {lineups.map((lineup) => (
              <tr key={lineup.id} className="hover:bg-primary-100/5 h-12">
                <td className="text-primary-100 px-6 py-4 text-sm font-medium whitespace-nowrap">
                  {lineup.player_korean_name || lineup.player_name}
                </td>
                <td className="text-primary-100 px-6 py-4 text-sm whitespace-nowrap">
                  {lineup.position_detail_name || "-"}
                </td>
                <td className="text-primary-100 px-6 py-4 text-sm whitespace-nowrap">
                  {getLineupTypeText(lineup.lineup_type)}
                </td>
                <td className="text-primary-100 px-6 py-4 text-sm whitespace-nowrap">
                  {lineup.is_captain && <Star size={16} className="text-yellow-500" />}
                </td>
                <td className="text-primary-100 px-6 py-4 text-sm whitespace-nowrap">
                  {getSubstitutionStatusText(lineup.substitution_status)}
                  {lineup.substitution_minute && ` (${lineup.substitution_minute}')`}
                </td>
                <td className="text-primary-100 px-6 py-4 text-sm whitespace-nowrap">
                  {lineup.goals}골 / {lineup.assists}어시
                </td>
                <td className="text-primary-100 px-6 py-4 text-sm whitespace-nowrap">
                  {lineup.yellow_cards > 0 && <span className="text-yellow-500">{lineup.yellow_cards}장</span>}
                  {lineup.is_sent_off && <span className="ml-2 text-red-500">퇴장</span>}
                </td>
                <td className="px-6 py-4 text-sm font-medium whitespace-nowrap">
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
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminMatchLineup;
