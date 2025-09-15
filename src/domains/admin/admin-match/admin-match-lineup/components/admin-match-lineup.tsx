/**
 * 작성자: KYD
 * 기능: 경기 라인업 관리 컴포넌트 - 라인업 CRUD 기능
 * 프로세스 설명: 특정 경기의 라인업 목록 조회, 생성, 수정, 삭제 기능 제공
 */
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { ArrowLeft, Edit, FolderPlus, Star, Trash2 } from "lucide-react";

import type { IMatchLineup } from "@admin/admin-match/admin-match-lineup/api/admin-match-lineup-api";
import { useCreateMatchLineup } from "@admin/admin-match/admin-match-lineup/api/react-query-api/use-create-match-lineup";
import { useDeleteMatchLineup } from "@admin/admin-match/admin-match-lineup/api/react-query-api/use-delete-match-lineup";
import { useGetAllPlayersSuspense } from "@admin/admin-match/admin-match-lineup/api/react-query-api/use-get-all-players-suspense";
import { useGetAllPositionsSuspense } from "@admin/admin-match/admin-match-lineup/api/react-query-api/use-get-all-positions-suspense";
import { useGetMatchLineupsSuspense } from "@admin/admin-match/admin-match-lineup/api/react-query-api/use-get-match-lineups-suspense";
import { useUpdateMatchLineup } from "@admin/admin-match/admin-match-lineup/api/react-query-api/use-update-match-lineup";

const AdminMatchLineup = () => {
  //SECTION HOOK호출 영역
  const navigate = useNavigate();
  const { matchId } = useParams<{ matchId: string }>();

  if (!matchId) {
    throw new Error("Match ID is required");
  }

  const { data: lineups } = useGetMatchLineupsSuspense(matchId);
  const { data: players } = useGetAllPlayersSuspense();
  const { data: positions } = useGetAllPositionsSuspense();
  const { mutateAsync: createLineup, isPending: isCreating } = useCreateMatchLineup(matchId);
  const { mutateAsync: updateLineup, isPending: isUpdating } = useUpdateMatchLineup(matchId);
  const { mutateAsync: deleteLineup } = useDeleteMatchLineup(matchId);
  //!SECTION HOOK호출 영역

  //SECTION 상태값 영역
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingLineup, setEditingLineup] = useState<IMatchLineup | null>(null);
  const [formData, setFormData] = useState({
    player_id: "",
    position_id: "",
    lineup_type: "STARTING" as "STARTING" | "BENCH",
    is_captain: false,
    substitution_status: "NONE" as "NONE" | "IN" | "OUT",
    substitution_minute: null as number | null,
    substitution_partner_id: "",
    yellow_cards: 0,
    red_card_minute: null as number | null,
    is_sent_off: false,
    goals: 0,
    assists: 0,
  });
  //!SECTION 상태값 영역

  //SECTION 메서드 영역
  const handleCreateLineup = async () => {
    await createLineup({
      match_id: matchId,
      player_id: formData.player_id,
      position_id: formData.position_id || undefined,
      lineup_type: formData.lineup_type,
      is_captain: formData.is_captain,
      substitution_status: formData.substitution_status,
      substitution_minute: formData.substitution_minute || undefined,
      substitution_partner_id: formData.substitution_partner_id || undefined,
      yellow_cards: formData.yellow_cards,
      red_card_minute: formData.red_card_minute || undefined,
      is_sent_off: formData.is_sent_off,
      goals: formData.goals,
      assists: formData.assists,
    });
    setIsCreateModalOpen(false);
    resetFormData();
  };

  const handleUpdateLineup = async () => {
    if (!editingLineup) return;

    await updateLineup({
      id: editingLineup.id,
      match_id: matchId,
      player_id: formData.player_id || undefined,
      position_id: formData.position_id || undefined,
      lineup_type: formData.lineup_type,
      is_captain: formData.is_captain,
      substitution_status: formData.substitution_status,
      substitution_minute: formData.substitution_minute || undefined,
      substitution_partner_id: formData.substitution_partner_id || undefined,
      yellow_cards: formData.yellow_cards,
      red_card_minute: formData.red_card_minute || undefined,
      is_sent_off: formData.is_sent_off,
      goals: formData.goals,
      assists: formData.assists,
    });
    setEditingLineup(null);
    resetFormData();
  };

  const handleDeleteLineup = async (id: number) => {
    if (!confirm("정말로 이 라인업을 삭제하시겠습니까?")) return;

    await deleteLineup(id);
  };

  const openEditModal = (lineup: IMatchLineup) => {
    setEditingLineup(lineup);
    setFormData({
      player_id: lineup.player_id,
      position_id: lineup.position_id || "",
      lineup_type: lineup.lineup_type as "STARTING" | "BENCH",
      is_captain: lineup.is_captain,
      substitution_status: lineup.substitution_status as "NONE" | "IN" | "OUT",
      substitution_minute: lineup.substitution_minute,
      substitution_partner_id: lineup.substitution_partner_id || "",
      yellow_cards: lineup.yellow_cards,
      red_card_minute: lineup.red_card_minute,
      is_sent_off: lineup.is_sent_off,
      goals: lineup.goals,
      assists: lineup.assists,
    });
  };

  const resetFormData = () => {
    setFormData({
      player_id: "",
      position_id: "",
      lineup_type: "STARTING",
      is_captain: false,
      substitution_status: "NONE",
      substitution_minute: null,
      substitution_partner_id: "",
      yellow_cards: 0,
      red_card_minute: null,
      is_sent_off: false,
      goals: 0,
      assists: 0,
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
      default:
        return "없음";
    }
  };
  //!SECTION 메서드 영역

  return (
    <div className="flex h-full w-full flex-col">
      {/* 고정된 헤더 */}
      <header className="layout-header-height bg-background-primary relative z-10 flex w-full shrink-0 items-center">
        <ArrowLeft
          size={24}
          className="text-primary-400 cursor-pointer"
          onClick={() => navigate(-1)}
          aria-label="뒤로가기"
        />
        <h1 className="text-primary-400 font-shilla-culture absolute left-1/2 -translate-x-1/2 text-2xl font-bold">
          라인업 관리
        </h1>
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="border-primary-400 text-primary-400 hover:bg-primary-500 absolute right-4 flex cursor-pointer items-center gap-2 rounded-lg border px-4 py-2 transition-colors"
          aria-label="새 라인업 추가"
        >
          <FolderPlus size={20} />
          선수 추가
        </button>
      </header>

      {/* 스크롤 가능한 컨텐츠 영역 - 헤더 높이를 제외한 나머지 영역 */}
      <div className="scrollbar-hide flex w-full flex-1 flex-col gap-4 overflow-y-auto">
        <table className="w-full">
          <thead className="bg-background-primary text-primary-400 border-background-secondary border-b">
            <tr>
              <th className="text-md px-6 py-3 text-left font-bold tracking-wider uppercase">선수명</th>
              <th className="text-md px-6 py-3 text-left font-bold tracking-wider uppercase">포지션</th>
              <th className="text-md px-6 py-3 text-left font-bold tracking-wider uppercase">라인업</th>
              <th className="text-md px-6 py-3 text-left font-bold tracking-wider uppercase">주장</th>
              <th className="text-md px-6 py-3 text-left font-bold tracking-wider uppercase">교체</th>
              <th className="text-md px-6 py-3 text-left font-bold tracking-wider uppercase">골/어시</th>
              <th className="text-md px-6 py-3 text-left font-bold tracking-wider uppercase">카드</th>
              <th className="text-md px-6 py-3 text-left font-bold tracking-wider uppercase">작업</th>
            </tr>
          </thead>
          <tbody className="bg-background-primary divide-background-secondary divide-y">
            {lineups.map((lineup) => (
              <tr key={lineup.id} className="hover:bg-background-secondary">
                <td className="text-primary-400 px-6 py-4 text-sm font-medium whitespace-nowrap">
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
                  <div className="flex gap-2">
                    <button
                      onClick={() => openEditModal(lineup)}
                      className="cursor-pointer text-indigo-500 hover:text-indigo-900"
                      aria-label="수정"
                    >
                      <Edit size={16} />
                    </button>
                    <button
                      onClick={() => handleDeleteLineup(lineup.id)}
                      className="cursor-pointer text-red-600 hover:text-red-900"
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

      {/* 생성 모달 */}
      {isCreateModalOpen && (
        <div className="bg-opacity-50 fixed inset-0 z-50 flex items-center justify-center bg-black">
          <div className="max-h-[90vh] w-96 overflow-y-auto rounded-lg bg-white p-6">
            <h2 className="mb-4 text-lg font-semibold">새 선수 추가</h2>
            <div className="space-y-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">선수 *</label>
                <select
                  value={formData.player_id}
                  onChange={(e) => setFormData({ ...formData, player_id: e.target.value })}
                  className="focus:ring-primary-400 w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:outline-none"
                >
                  <option value="">선수를 선택하세요</option>
                  {players.map((player) => (
                    <option key={player.id} value={player.id}>
                      {player.korean_name || player.name} ({player.jersey_number}번)
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">포지션</label>
                <select
                  value={formData.position_id}
                  onChange={(e) => setFormData({ ...formData, position_id: e.target.value })}
                  className="focus:ring-primary-400 w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:outline-none"
                >
                  <option value="">포지션을 선택하세요</option>
                  {positions.map((position) => (
                    <option key={position.id} value={position.id}>
                      {position.position_detail_name} ({position.position_code})
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">라인업 타입 *</label>
                <select
                  value={formData.lineup_type}
                  onChange={(e) => setFormData({ ...formData, lineup_type: e.target.value as "STARTING" | "BENCH" })}
                  className="focus:ring-primary-400 w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:outline-none"
                >
                  <option value="STARTING">선발</option>
                  <option value="BENCH">벤치</option>
                </select>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.is_captain}
                  onChange={(e) => setFormData({ ...formData, is_captain: e.target.checked })}
                  className="mr-2"
                />
                <label className="text-sm font-medium text-gray-700">주장</label>
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">교체 상태</label>
                <select
                  value={formData.substitution_status}
                  onChange={(e) =>
                    setFormData({ ...formData, substitution_status: e.target.value as "NONE" | "IN" | "OUT" })
                  }
                  className="focus:ring-primary-400 w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:outline-none"
                >
                  <option value="NONE">없음</option>
                  <option value="IN">교체투입</option>
                  <option value="OUT">교체아웃</option>
                </select>
              </div>
              {formData.substitution_status !== "NONE" && (
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">교체 시간 (분)</label>
                  <input
                    type="number"
                    min="1"
                    max="120"
                    value={formData.substitution_minute || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, substitution_minute: parseInt(e.target.value) || null })
                    }
                    className="focus:ring-primary-400 w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:outline-none"
                  />
                </div>
              )}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">골</label>
                  <input
                    type="number"
                    min="0"
                    value={formData.goals}
                    onChange={(e) => setFormData({ ...formData, goals: parseInt(e.target.value) || 0 })}
                    className="focus:ring-primary-400 w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">어시스트</label>
                  <input
                    type="number"
                    min="0"
                    value={formData.assists}
                    onChange={(e) => setFormData({ ...formData, assists: parseInt(e.target.value) || 0 })}
                    className="focus:ring-primary-400 w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:outline-none"
                  />
                </div>
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">옐로우 카드</label>
                <input
                  type="number"
                  min="0"
                  max="2"
                  value={formData.yellow_cards}
                  onChange={(e) => setFormData({ ...formData, yellow_cards: parseInt(e.target.value) || 0 })}
                  className="focus:ring-primary-400 w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:outline-none"
                />
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.is_sent_off}
                  onChange={(e) => setFormData({ ...formData, is_sent_off: e.target.checked })}
                  className="mr-2"
                />
                <label className="text-sm font-medium text-gray-700">퇴장</label>
              </div>
              {formData.is_sent_off && (
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">퇴장 시간 (분)</label>
                  <input
                    type="number"
                    min="1"
                    max="120"
                    value={formData.red_card_minute || ""}
                    onChange={(e) => setFormData({ ...formData, red_card_minute: parseInt(e.target.value) || null })}
                    className="focus:ring-primary-400 w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:outline-none"
                  />
                </div>
              )}
            </div>
            <div className="mt-6 flex gap-2">
              <button
                onClick={() => {
                  setIsCreateModalOpen(false);
                  resetFormData();
                }}
                className="flex-1 rounded-md border border-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-50"
              >
                취소
              </button>
              <button
                onClick={handleCreateLineup}
                disabled={!formData.player_id || isCreating}
                className="bg-primary-400 hover:bg-primary-500 flex-1 rounded-md px-4 py-2 text-white disabled:opacity-50"
              >
                {isCreating ? "추가 중..." : "추가"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 수정 모달 */}
      {editingLineup && (
        <div className="bg-opacity-50 fixed inset-0 z-50 flex items-center justify-center bg-black">
          <div className="max-h-[90vh] w-96 overflow-y-auto rounded-lg bg-white p-6">
            <h2 className="mb-4 text-lg font-semibold">라인업 수정</h2>
            <div className="space-y-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">선수 *</label>
                <select
                  value={formData.player_id}
                  onChange={(e) => setFormData({ ...formData, player_id: e.target.value })}
                  className="focus:ring-primary-400 w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:outline-none"
                >
                  <option value="">선수를 선택하세요</option>
                  {players.map((player) => (
                    <option key={player.id} value={player.id}>
                      {player.korean_name || player.name} ({player.jersey_number}번)
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">포지션</label>
                <select
                  value={formData.position_id}
                  onChange={(e) => setFormData({ ...formData, position_id: e.target.value })}
                  className="focus:ring-primary-400 w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:outline-none"
                >
                  <option value="">포지션을 선택하세요</option>
                  {positions.map((position) => (
                    <option key={position.id} value={position.id}>
                      {position.position_detail_name} ({position.position_code})
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">라인업 타입 *</label>
                <select
                  value={formData.lineup_type}
                  onChange={(e) => setFormData({ ...formData, lineup_type: e.target.value as "STARTING" | "BENCH" })}
                  className="focus:ring-primary-400 w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:outline-none"
                >
                  <option value="STARTING">선발</option>
                  <option value="BENCH">벤치</option>
                </select>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.is_captain}
                  onChange={(e) => setFormData({ ...formData, is_captain: e.target.checked })}
                  className="mr-2"
                />
                <label className="text-sm font-medium text-gray-700">주장</label>
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">교체 상태</label>
                <select
                  value={formData.substitution_status}
                  onChange={(e) =>
                    setFormData({ ...formData, substitution_status: e.target.value as "NONE" | "IN" | "OUT" })
                  }
                  className="focus:ring-primary-400 w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:outline-none"
                >
                  <option value="NONE">없음</option>
                  <option value="IN">교체투입</option>
                  <option value="OUT">교체아웃</option>
                </select>
              </div>
              {formData.substitution_status !== "NONE" && (
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">교체 시간 (분)</label>
                  <input
                    type="number"
                    min="1"
                    max="120"
                    value={formData.substitution_minute || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, substitution_minute: parseInt(e.target.value) || null })
                    }
                    className="focus:ring-primary-400 w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:outline-none"
                  />
                </div>
              )}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">골</label>
                  <input
                    type="number"
                    min="0"
                    value={formData.goals}
                    onChange={(e) => setFormData({ ...formData, goals: parseInt(e.target.value) || 0 })}
                    className="focus:ring-primary-400 w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">어시스트</label>
                  <input
                    type="number"
                    min="0"
                    value={formData.assists}
                    onChange={(e) => setFormData({ ...formData, assists: parseInt(e.target.value) || 0 })}
                    className="focus:ring-primary-400 w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:outline-none"
                  />
                </div>
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">옐로우 카드</label>
                <input
                  type="number"
                  min="0"
                  max="2"
                  value={formData.yellow_cards}
                  onChange={(e) => setFormData({ ...formData, yellow_cards: parseInt(e.target.value) || 0 })}
                  className="focus:ring-primary-400 w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:outline-none"
                />
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.is_sent_off}
                  onChange={(e) => setFormData({ ...formData, is_sent_off: e.target.checked })}
                  className="mr-2"
                />
                <label className="text-sm font-medium text-gray-700">퇴장</label>
              </div>
              {formData.is_sent_off && (
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">퇴장 시간 (분)</label>
                  <input
                    type="number"
                    min="1"
                    max="120"
                    value={formData.red_card_minute || ""}
                    onChange={(e) => setFormData({ ...formData, red_card_minute: parseInt(e.target.value) || null })}
                    className="focus:ring-primary-400 w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:outline-none"
                  />
                </div>
              )}
            </div>
            <div className="mt-6 flex gap-2">
              <button
                onClick={() => {
                  setEditingLineup(null);
                  resetFormData();
                }}
                className="flex-1 rounded-md border border-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-50"
              >
                취소
              </button>
              <button
                onClick={handleUpdateLineup}
                disabled={!formData.player_id || isUpdating}
                className="bg-primary-400 hover:bg-primary-500 flex-1 rounded-md px-4 py-2 text-white disabled:opacity-50"
              >
                {isUpdating ? "수정 중..." : "수정"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminMatchLineup;
