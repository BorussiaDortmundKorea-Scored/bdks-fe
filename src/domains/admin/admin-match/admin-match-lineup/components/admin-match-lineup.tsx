/**
 * 작성자: KYD
 * 기능: 경기 라인업 관리 컴포넌트 - 라인업 CRUD 기능
 * 프로세스 설명: 특정 경기의 라인업 목록 조회, 생성, 수정, 삭제 기능 제공
 */
import { useMemo, useState } from "react";
import { useParams } from "react-router-dom";

import { Button, Input, SelectBox, useSelectBox } from "@youngduck/yd-ui";
import { Edit, FolderPlus, Star, Trash2 } from "lucide-react";

import type { IMatchLineup } from "@admin/admin-match/admin-match-lineup/api/admin-match-lineup-api";
import { useCreateMatchLineup } from "@admin/admin-match/admin-match-lineup/api/react-query-api/use-create-match-lineup";
import { useDeleteMatchLineup } from "@admin/admin-match/admin-match-lineup/api/react-query-api/use-delete-match-lineup";
import { useGetAllPlayersSuspense } from "@admin/admin-match/admin-match-lineup/api/react-query-api/use-get-all-players-suspense";
import { useGetAllPositionsSuspense } from "@admin/admin-match/admin-match-lineup/api/react-query-api/use-get-all-positions-suspense";
import { useGetMatchLineupsSuspense } from "@admin/admin-match/admin-match-lineup/api/react-query-api/use-get-match-lineups-suspense";
import { useUpdateMatchLineup } from "@admin/admin-match/admin-match-lineup/api/react-query-api/use-update-match-lineup";

const AdminMatchLineup = () => {
  //SECTION HOOK호출 영역
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
    substitution_status: "NONE" as "NONE" | "SUBSTITUTED_IN" | "SUBSTITUTED_OUT",
    substitution_minute: null as number | null,
    substitution_partner_id: "",
    yellow_cards: 0,
    red_card_minute: null as number | null,
    is_sent_off: false,
    goals: 0,
    assists: 0,
  });
  //!SECTION 상태값 영역

  //SECTION SelectBox 옵션/훅
  const playerOptions = useMemo(
    () =>
      players.map((p) => ({
        label: p.id,
        value: `${p.korean_name || p.name}${p.jersey_number ? ` (${p.jersey_number}번)` : ""}`,
      })),
    [players],
  );

  const positionOptions = useMemo(
    () => positions.map((pos) => ({ label: pos.id, value: `${pos.position_detail_name} (${pos.position_code})` })),
    [positions],
  );

  const lineupTypeOptions = useMemo(
    () => [
      { label: "STARTING", value: "선발" },
      { label: "BENCH", value: "벤치" },
    ],
    [],
  );

  const substitutionStatusOptions = useMemo(
    () => [
      { label: "NONE", value: "없음" },
      { label: "SUBSTITUTED_IN", value: "교체투입" },
      { label: "SUBSTITUTED_OUT", value: "교체아웃" },
    ],
    [],
  );

  const getPlayerValueById = (id: string) => playerOptions.find((o) => o.label === id)?.value;
  const getPositionValueById = (id: string) => positionOptions.find((o) => o.label === id)?.value;

  // 생성 모달 훅
  const createPlayerHook = useSelectBox({ options: playerOptions, search: true });
  const createPositionHook = useSelectBox({ options: positionOptions, search: true });
  const createLineupTypeHook = useSelectBox({ options: lineupTypeOptions, defaultValue: "선발" });
  const createSubStatusHook = useSelectBox({ options: substitutionStatusOptions, defaultValue: "없음" });
  const createSubPartnerHook = useSelectBox({ options: playerOptions, search: true });

  // 수정 모달 훅
  const editPlayerHook = useSelectBox({
    options: playerOptions,
    search: true,
    defaultValue: editingLineup ? getPlayerValueById(editingLineup.player_id) : undefined,
  });
  const editPositionHook = useSelectBox({
    options: positionOptions,
    search: true,
    defaultValue:
      editingLineup && editingLineup.position_id ? getPositionValueById(editingLineup.position_id) : undefined,
  });
  const editLineupTypeHook = useSelectBox({
    options: lineupTypeOptions,
    defaultValue: editingLineup ? (editingLineup.lineup_type === "STARTING" ? "선발" : "벤치") : undefined,
  });
  const editSubStatusHook = useSelectBox({
    options: substitutionStatusOptions,
    defaultValue: editingLineup
      ? editingLineup.substitution_status === "NONE"
        ? "없음"
        : editingLineup.substitution_status === "SUBSTITUTED_IN"
          ? "교체투입"
          : "교체아웃"
      : undefined,
  });
  const editSubPartnerHook = useSelectBox({
    options: playerOptions,
    search: true,
    defaultValue:
      editingLineup && editingLineup.substitution_partner_id
        ? getPlayerValueById(editingLineup.substitution_partner_id)
        : undefined,
  });
  //!SECTION SelectBox 옵션/훅

  //SECTION 메서드 영역
  const handleCreateLineup = async () => {
    await createLineup({
      match_id: matchId,
      player_id: (createPlayerHook.label as string) || formData.player_id,
      position_id: (createPositionHook.label as string) || undefined,
      lineup_type: (createLineupTypeHook.label as "STARTING" | "BENCH") || formData.lineup_type,
      is_captain: formData.is_captain,
      substitution_status:
        (createSubStatusHook.label as "NONE" | "SUBSTITUTED_IN" | "SUBSTITUTED_OUT") || formData.substitution_status,
      substitution_minute: formData.substitution_minute || undefined,
      substitution_partner_id: (createSubPartnerHook.label as string) || formData.substitution_partner_id || undefined,
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
      player_id: (editPlayerHook.label as string) || formData.player_id || undefined,
      position_id: (editPositionHook.label as string) || formData.position_id || undefined,
      lineup_type: (editLineupTypeHook.label as "STARTING" | "BENCH") || formData.lineup_type,
      is_captain: formData.is_captain,
      substitution_status:
        (editSubStatusHook.label as "NONE" | "SUBSTITUTED_IN" | "SUBSTITUTED_OUT") || formData.substitution_status,
      substitution_minute: formData.substitution_minute || undefined,
      substitution_partner_id: (editSubPartnerHook.label as string) || formData.substitution_partner_id || undefined,
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
      substitution_status: lineup.substitution_status as "NONE" | "SUBSTITUTED_IN" | "SUBSTITUTED_OUT",
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
          onClick={() => setIsCreateModalOpen(true)}
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
                    <button
                      onClick={() => openEditModal(lineup)}
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

      {/* 생성 모달 */}
      {isCreateModalOpen && (
        <div className="bg-background-primary-layer fixed inset-0 z-50 flex items-center justify-center">
          <div className="bg-background-secondary flex h-[90vh] w-96 flex-col gap-4 overflow-y-auto rounded-lg p-6">
            <h2 className="text-yds-b1 text-primary-100">새 선수 추가</h2>
            <div className="flex flex-col gap-4">
              <div>
                <label className="text-yds-b1 text-primary-100">선수 *</label>
                <SelectBox size="full" selectBoxHook={createPlayerHook} />
              </div>
              <div>
                <label className="text-yds-b1 text-primary-100">포지션</label>
                <SelectBox size="full" selectBoxHook={createPositionHook} />
              </div>
              <div>
                <label className="text-yds-b1 text-primary-100">라인업 타입 *</label>
                <SelectBox size="full" selectBoxHook={createLineupTypeHook} />
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.is_captain}
                  onChange={(e) => setFormData({ ...formData, is_captain: e.target.checked })}
                  className="mr-2"
                />
                <label className="text-primary-100 text-sm">주장</label>
              </div>
              <div>
                <label className="text-yds-b1 text-primary-100">교체 상태</label>
                <SelectBox size="full" selectBoxHook={createSubStatusHook} />
              </div>
              {(createSubStatusHook.label === "SUBSTITUTED_IN" || createSubStatusHook.label === "SUBSTITUTED_OUT") && (
                <div>
                  <label className="text-yds-b1 text-primary-100">교체 시간 (분)</label>
                  <Input
                    type="number"
                    min={1}
                    max={120}
                    value={formData.substitution_minute || ""}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setFormData({ ...formData, substitution_minute: parseInt(e.target.value) || null })
                    }
                    size="full"
                    color="primary-100"
                    placeholder="예: 67"
                  />
                  <div className="mt-3">
                    <label className="text-yds-b1 text-primary-100">교체 대상 선수</label>
                    <SelectBox size="full" selectBoxHook={createSubPartnerHook} />
                  </div>
                </div>
              )}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-yds-b1 text-primary-100">골</label>
                  <Input
                    type="number"
                    min={0}
                    value={formData.goals}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setFormData({ ...formData, goals: parseInt(e.target.value) || 0 })
                    }
                    size="full"
                    color="primary-100"
                    placeholder="0"
                  />
                </div>
                <div>
                  <label className="text-yds-b1 text-primary-100">어시스트</label>
                  <Input
                    type="number"
                    min={0}
                    value={formData.assists}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setFormData({ ...formData, assists: parseInt(e.target.value) || 0 })
                    }
                    size="full"
                    color="primary-100"
                    placeholder="0"
                  />
                </div>
              </div>
              <div>
                <label className="text-yds-b1 text-primary-100">옐로우 카드</label>
                <Input
                  type="number"
                  min={0}
                  max={2}
                  value={formData.yellow_cards}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setFormData({ ...formData, yellow_cards: parseInt(e.target.value) || 0 })
                  }
                  size="full"
                  color="primary-100"
                  placeholder="0"
                />
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.is_sent_off}
                  onChange={(e) => setFormData({ ...formData, is_sent_off: e.target.checked })}
                  className="mr-2"
                />
                <label className="text-primary-100 text-sm">퇴장</label>
              </div>
              {formData.is_sent_off && (
                <div>
                  <label className="text-yds-b1 text-primary-100">퇴장 시간 (분)</label>
                  <Input
                    type="number"
                    min={1}
                    max={120}
                    value={formData.red_card_minute || ""}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setFormData({ ...formData, red_card_minute: parseInt(e.target.value) || null })
                    }
                    size="full"
                    color="primary-100"
                    placeholder="예: 90"
                  />
                </div>
              )}
            </div>
            <div className="mt-6 flex gap-2">
              <Button
                variant="outlined"
                color="primary"
                size="full"
                onClick={() => {
                  setIsCreateModalOpen(false);
                  resetFormData();
                }}
              >
                취소
              </Button>
              <Button variant="fill" color="primary" size="full" onClick={handleCreateLineup} disabled={isCreating}>
                {isCreating ? "추가 중..." : "추가"}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* 수정 모달 */}
      {editingLineup && (
        <div className="bg-background-primary-layer fixed inset-0 z-50 flex items-center justify-center">
          <div className="bg-background-secondary flex h-[90vh] w-96 flex-col gap-4 overflow-y-auto rounded-lg p-6">
            <h2 className="text-yds-b1 text-primary-100">라인업 수정</h2>
            <div className="flex flex-col gap-4">
              <div>
                <label className="text-yds-b1 text-primary-100">선수 *</label>
                <SelectBox size="full" selectBoxHook={editPlayerHook} />
              </div>
              <div>
                <label className="text-yds-b1 text-primary-100">포지션</label>
                <SelectBox size="full" selectBoxHook={editPositionHook} />
              </div>
              <div>
                <label className="text-yds-b1 text-primary-100">라인업 타입 *</label>
                <SelectBox size="full" selectBoxHook={editLineupTypeHook} />
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.is_captain}
                  onChange={(e) => setFormData({ ...formData, is_captain: e.target.checked })}
                  className="mr-2"
                />
                <label className="text-primary-100 text-sm">주장</label>
              </div>
              <div>
                <label className="text-yds-b1 text-primary-100">교체 상태</label>
                <SelectBox size="full" selectBoxHook={editSubStatusHook} />
              </div>
              {(editSubStatusHook.label === "SUBSTITUTED_IN" || editSubStatusHook.label === "SUBSTITUTED_OUT") && (
                <div>
                  <label className="text-yds-b1 text-primary-100">교체 시간 (분)</label>
                  <Input
                    type="number"
                    min={1}
                    max={120}
                    value={formData.substitution_minute || ""}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setFormData({ ...formData, substitution_minute: parseInt(e.target.value) || null })
                    }
                    size="full"
                    color="primary-100"
                    placeholder="예: 67"
                  />
                  <div className="mt-3">
                    <label className="text-yds-b1 text-primary-100">교체 대상 선수</label>
                    <SelectBox size="full" selectBoxHook={editSubPartnerHook} />
                  </div>
                </div>
              )}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-yds-b1 text-primary-100">골</label>
                  <Input
                    type="number"
                    min={0}
                    value={formData.goals}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setFormData({ ...formData, goals: parseInt(e.target.value) || 0 })
                    }
                    size="full"
                    color="primary-100"
                    placeholder="0"
                  />
                </div>
                <div>
                  <label className="text-yds-b1 text-primary-100">어시스트</label>
                  <Input
                    type="number"
                    min={0}
                    value={formData.assists}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setFormData({ ...formData, assists: parseInt(e.target.value) || 0 })
                    }
                    size="full"
                    color="primary-100"
                    placeholder="0"
                  />
                </div>
              </div>
              <div>
                <label className="text-yds-b1 text-primary-100">옐로우 카드</label>
                <Input
                  type="number"
                  min={0}
                  max={2}
                  value={formData.yellow_cards}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setFormData({ ...formData, yellow_cards: parseInt(e.target.value) || 0 })
                  }
                  size="full"
                  color="primary-100"
                  placeholder="0"
                />
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.is_sent_off}
                  onChange={(e) => setFormData({ ...formData, is_sent_off: e.target.checked })}
                  className="mr-2"
                />
                <label className="text-primary-100 text-sm">퇴장</label>
              </div>
              {formData.is_sent_off && (
                <div>
                  <label className="text-yds-b1 text-primary-100">퇴장 시간 (분)</label>
                  <Input
                    type="number"
                    min={1}
                    max={120}
                    value={formData.red_card_minute || ""}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setFormData({ ...formData, red_card_minute: parseInt(e.target.value) || null })
                    }
                    size="full"
                    color="primary-100"
                    placeholder="예: 90"
                  />
                </div>
              )}
            </div>
            <div className="mt-6 flex gap-2">
              <Button
                variant="outlined"
                color="primary"
                size="full"
                onClick={() => {
                  setEditingLineup(null);
                  resetFormData();
                }}
              >
                취소
              </Button>
              <Button variant="fill" color="primary" size="full" onClick={handleUpdateLineup} disabled={isUpdating}>
                {isUpdating ? "수정 중..." : "수정"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminMatchLineup;
