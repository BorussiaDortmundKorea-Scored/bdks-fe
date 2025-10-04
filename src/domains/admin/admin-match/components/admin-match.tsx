/**
 * 작성자: KYD
 * 기능: 경기 관리 컴포넌트 - 경기 CRUD 기능
 * 프로세스 설명: 경기 목록 조회, 생성, 수정, 삭제 기능 제공 및 라인업 관리 접근
 */
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import { Button, Input, SelectBox, useSelectBox } from "@youngduck/yd-ui";
import { Edit, FolderPlus, Trash2, Users } from "lucide-react";

import { useGetAllCompetitionsSuspense } from "@admin/admin-competition/api/react-query-api/use-get-all-competitions-suspense";
import type { IMatch } from "@admin/admin-match/api/admin-match-api";
import { useCreateMatch } from "@admin/admin-match/api/react-query-api/use-create-match";
import { useDeleteMatch } from "@admin/admin-match/api/react-query-api/use-delete-match";
import { useGetAllMatchesSuspense } from "@admin/admin-match/api/react-query-api/use-get-all-matches-suspense";
import { useUpdateMatch } from "@admin/admin-match/api/react-query-api/use-update-match";
import { useGetAllTeamsSuspense } from "@admin/admin-team/api/react-query-api/use-get-all-teams-suspense";

const AdminMatch = () => {
  //SECTION HOOK호출 영역
  const navigate = useNavigate();
  const { data: matches } = useGetAllMatchesSuspense();
  const { data: competitions } = useGetAllCompetitionsSuspense();
  const { data: teams } = useGetAllTeamsSuspense();
  const { mutateAsync: createMatch, isPending: isCreating } = useCreateMatch();
  const { mutateAsync: updateMatch, isPending: isUpdating } = useUpdateMatch();
  const { mutateAsync: deleteMatch } = useDeleteMatch();
  //!SECTION HOOK호출 영역

  //SECTION 상태값 영역
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingMatch, setEditingMatch] = useState<IMatch | null>(null);
  const [formData, setFormData] = useState({
    competition_id: "",
    opponent_team_id: "",
    match_date: "",
    home_away: "HOME" as "HOME" | "AWAY",
    our_score: 0,
    opponent_score: 0,
    formation: "",
    is_live: false,
    round_name: "",
    match_start_time: "",
    second_half_start_time: "",
    first_half_end_time: "",
    second_half_end_time: "",
  });
  //!SECTION 상태값 영역

  //SECTION SelectBox 옵션/훅
  const competitionOptions = useMemo(
    () =>
      competitions.map((c) => ({
        label: c.id,
        value: `${c.name} (${c.season})`,
      })),
    [competitions],
  );

  const teamOptions = useMemo(() => teams.map((t) => ({ label: t.id, value: t.name })), [teams]);

  const homeAwayOptions = useMemo(
    () => [
      { label: "HOME", value: "홈" },
      { label: "AWAY", value: "어웨이" },
    ],
    [],
  );

  const getCompetitionValueById = (id: string) => competitionOptions.find((o) => o.label === id)?.value;
  const getTeamValueById = (id: string) => teamOptions.find((o) => o.label === id)?.value;

  // 생성 모달 훅
  const createCompetitionHook = useSelectBox({ options: competitionOptions, search: true });
  const createTeamHook = useSelectBox({ options: teamOptions, search: true });
  const createHomeAwayHook = useSelectBox({ options: homeAwayOptions, defaultValue: "홈" });

  // 수정 모달 훅
  const editCompetitionHook = useSelectBox({
    options: competitionOptions,
    search: true,
    defaultValue: formData.competition_id ? getCompetitionValueById(formData.competition_id) : undefined,
  });
  const editTeamHook = useSelectBox({
    options: teamOptions,
    search: true,
    defaultValue: formData.opponent_team_id ? getTeamValueById(formData.opponent_team_id) : undefined,
  });
  const editHomeAwayHook = useSelectBox({
    options: homeAwayOptions,
    defaultValue: formData.home_away === "HOME" ? "홈" : "어웨이",
  });
  //!SECTION SelectBox 옵션/훅

  //SECTION 메서드 영역
  const handleCreateMatch = async () => {
    await createMatch({
      competition_id: createCompetitionHook.label || formData.competition_id,
      opponent_team_id: createTeamHook.label || formData.opponent_team_id,
      match_date: formData.match_date,
      home_away: (createHomeAwayHook.label as "HOME" | "AWAY") || formData.home_away,
      our_score: formData.our_score,
      opponent_score: formData.opponent_score,
      formation: formData.formation || undefined,
      is_live: formData.is_live,
      round_name: formData.round_name || undefined,
      match_start_time: formData.match_start_time,
      second_half_start_time: formData.second_half_start_time,
      first_half_end_time: formData.first_half_end_time,
      second_half_end_time: formData.second_half_end_time,
    });
    setIsCreateModalOpen(false);
    resetFormData();
  };

  const handleUpdateMatch = async () => {
    if (!editingMatch) return;

    await updateMatch({
      id: editingMatch.id,
      competition_id: editCompetitionHook.label || formData.competition_id || undefined,
      opponent_team_id: editTeamHook.label || formData.opponent_team_id || undefined,
      match_date: formData.match_date || undefined,
      home_away: (editHomeAwayHook.label as "HOME" | "AWAY") || formData.home_away,
      our_score: formData.our_score,
      opponent_score: formData.opponent_score,
      formation: formData.formation || undefined,
      is_live: formData.is_live,
      round_name: formData.round_name || undefined,
      match_start_time: formData.match_start_time,
      second_half_start_time: formData.second_half_start_time,
      first_half_end_time: formData.first_half_end_time,
      second_half_end_time: formData.second_half_end_time,
    });
    setEditingMatch(null);
    resetFormData();
  };

  const handleDeleteMatch = async (id: string) => {
    if (!confirm("정말로 이 경기를 삭제하시겠습니까?")) return;

    await deleteMatch(id);
  };

  const openEditModal = (match: IMatch) => {
    setEditingMatch(match);
    setFormData({
      competition_id: match.competition_id,
      opponent_team_id: match.opponent_team_id,
      match_date: match.match_date,
      home_away: match.home_away as "HOME" | "AWAY",
      our_score: match.our_score,
      opponent_score: match.opponent_score,
      formation: match.formation || "",
      is_live: match.is_live,
      round_name: match.round_name,
      match_start_time: match.match_start_time ? new Date(match.match_start_time).toISOString().slice(0, 16) : "",
      second_half_start_time: match.second_half_start_time
        ? new Date(match.second_half_start_time).toISOString().slice(0, 16)
        : "",
      first_half_end_time: match.first_half_end_time
        ? new Date(match.first_half_end_time).toISOString().slice(0, 16)
        : "",
      second_half_end_time: match.second_half_end_time
        ? new Date(match.second_half_end_time).toISOString().slice(0, 16)
        : "",
    });
  };

  const resetFormData = () => {
    setFormData({
      competition_id: "",
      opponent_team_id: "",
      match_date: "",
      home_away: "HOME",
      our_score: 0,
      opponent_score: 0,
      formation: "",
      is_live: false,
      round_name: "",
      match_start_time: "",
      second_half_start_time: "",
      first_half_end_time: "",
      second_half_end_time: "",
    });
  };

  const handleLineupManagement = (matchId: string) => {
    navigate(`/admin/match/${matchId}/lineup`);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("ko-KR");
  };
  //!SECTION 메서드 영역

  return (
    <div className="flex h-full w-full flex-col">
      {/* 헤더 */}
      <div className="flex w-full items-center justify-between p-4">
        <h2 className="text-yds-s1 text-primary-100">경기 관리</h2>
        <Button
          variant="outlined"
          color="primary"
          size="md"
          onClick={() => setIsCreateModalOpen(true)}
          className="flex items-center gap-2"
          aria-label="새 경기 추가"
        >
          <FolderPlus size={20} />
          경기 추가
        </Button>
      </div>

      {/* 스크롤 가능한 컨텐츠 영역 */}
      <div className="scrollbar-hide border-primary-100 flex w-full flex-1 flex-col gap-4 overflow-y-auto rounded-lg border-2">
        <table className="w-full">
          <thead className="bg-background-primary text-primary-400 border-primary-100 text-yds-b1 border-b-2">
            <tr className="h-12">
              <th className="px-6 text-left uppercase">경기일</th>
              <th className="px-6 text-left uppercase">대회</th>
              <th className="px-6 text-left uppercase">상대팀</th>
              <th className="px-6 text-left uppercase">홈/어웨이</th>
              <th className="px-6 text-left uppercase">스코어</th>
              <th className="px-6 text-left uppercase">라운드</th>
              <th className="px-6 text-left uppercase">작업</th>
            </tr>
          </thead>
          <tbody className="bg-background-primary">
            {matches.map((match) => (
              <tr
                key={match.id}
                className="hover:bg-primary-100/5 h-12 cursor-pointer"
                onClick={() => handleLineupManagement(match.id)}
              >
                <td className="text-primary-100 px-6 py-4 text-sm font-medium whitespace-nowrap">
                  {formatDate(match.match_date)}
                </td>
                <td className="text-primary-100 px-6 py-4 text-sm whitespace-nowrap">{match.competition_name}</td>
                <td className="text-primary-100 px-6 py-4 text-sm whitespace-nowrap">{match.opponent_team_name}</td>
                <td className="text-primary-100 px-6 py-4 text-sm whitespace-nowrap">
                  {match.home_away === "HOME" ? "홈" : "어웨이"}
                </td>
                <td className="text-primary-100 px-6 py-4 text-sm whitespace-nowrap">
                  {match.our_score} : {match.opponent_score}
                </td>
                <td className="text-primary-100 px-6 py-4 text-sm whitespace-nowrap">{match.round_name}</td>
                <td className="px-6 py-4 text-sm font-medium whitespace-nowrap">
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
                        openEditModal(match);
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
            <h2 className="text-yds-b1 text-primary-100">새 경기 추가</h2>
            <div className="space-y-4">
              <div>
                <label className="text-yds-b1 text-primary-100">대회 *</label>
                <SelectBox size="full" selectBoxHook={createCompetitionHook} />
              </div>
              <div>
                <label className="text-yds-b1 text-primary-100">상대팀 *</label>
                <SelectBox size="full" selectBoxHook={createTeamHook} />
              </div>
              <div>
                <label className="text-yds-b1 text-primary-100">경기일 *</label>
                <Input
                  type="date"
                  value={formData.match_date}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setFormData({ ...formData, match_date: e.target.value })
                  }
                  size="full"
                  color="primary-100"
                />
              </div>
              <div>
                <label className="text-yds-b1 text-primary-100">홈/어웨이 *</label>
                <SelectBox size="full" selectBoxHook={createHomeAwayHook} />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-yds-b1 text-primary-100">우리 점수</label>
                  <Input
                    type="number"
                    min={0}
                    value={formData.our_score}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setFormData({ ...formData, our_score: parseInt(e.target.value) || 0 })
                    }
                    size="full"
                    color="primary-100"
                  />
                </div>
                <div>
                  <label className="text-yds-b1 text-primary-100">상대 점수</label>
                  <Input
                    type="number"
                    min={0}
                    value={formData.opponent_score}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setFormData({ ...formData, opponent_score: parseInt(e.target.value) || 0 })
                    }
                    size="full"
                    color="primary-100"
                  />
                </div>
              </div>
              <div>
                <label className="text-yds-b1 text-primary-100">포메이션</label>
                <Input
                  type="text"
                  value={formData.formation}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setFormData({ ...formData, formation: e.target.value })
                  }
                  size="full"
                  color="primary-100"
                  placeholder="예: 4-3-3"
                />
              </div>
              <div>
                <label className="text-yds-b1 text-primary-100">라운드명</label>
                <Input
                  type="text"
                  value={formData.round_name}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setFormData({ ...formData, round_name: e.target.value })
                  }
                  size="full"
                  color="primary-100"
                  placeholder="예: 1라운드"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-yds-b1 text-primary-100">경기 시작 시간</label>
                  <Input
                    type="datetime-local"
                    value={formData.match_start_time}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setFormData({ ...formData, match_start_time: e.target.value })
                    }
                    placeholder="경기 시작 시간"
                    size="full"
                    color="primary-100"
                  />
                </div>
                <div>
                  <label className="text-yds-b1 text-primary-100">후반 시작 시간</label>
                  <Input
                    type="datetime-local"
                    value={formData.second_half_start_time}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setFormData({ ...formData, second_half_start_time: e.target.value })
                    }
                    placeholder="후반 시작 시간"
                    size="full"
                    color="primary-100"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-yds-b1 text-primary-100">전반 종료 시간</label>
                  <Input
                    type="datetime-local"
                    value={formData.first_half_end_time}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setFormData({ ...formData, first_half_end_time: e.target.value })
                    }
                    placeholder="전반 종료 시간"
                    size="full"
                    color="primary-100"
                  />
                </div>
                <div>
                  <label className="text-yds-b1 text-primary-100">후반 종료 시간</label>
                  <Input
                    type="datetime-local"
                    value={formData.second_half_end_time}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setFormData({ ...formData, second_half_end_time: e.target.value })
                    }
                    placeholder="후반 종료 시간"
                    size="full"
                    color="primary-100"
                  />
                </div>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.is_live}
                  onChange={(e) => setFormData({ ...formData, is_live: e.target.checked })}
                  className="mr-2"
                />
                <label className="text-primary-100 text-sm">라이브 경기</label>
              </div>
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
              <Button
                variant="fill"
                color="primary"
                size="full"
                onClick={handleCreateMatch}
                disabled={isCreating || !createCompetitionHook.label || !createTeamHook.label || !formData.match_date}
              >
                {isCreating ? "추가 중..." : "추가"}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* 수정 모달 */}
      {editingMatch && (
        <div className="bg-background-primary-layer fixed inset-0 z-50 flex items-center justify-center">
          <div className="bg-background-secondary flex h-[90vh] w-96 flex-col gap-4 overflow-y-auto rounded-lg p-6">
            <h2 className="text-yds-b1 text-primary-100">경기 수정</h2>
            <div className="space-y-4">
              <div>
                <label className="text-yds-b1 text-primary-100">대회 *</label>
                <SelectBox size="full" selectBoxHook={editCompetitionHook} />
              </div>
              <div>
                <label className="text-yds-b1 text-primary-100">상대팀 *</label>
                <SelectBox size="full" selectBoxHook={editTeamHook} />
              </div>
              <div>
                <label className="text-yds-b1 text-primary-100">경기일 *</label>
                <Input
                  type="date"
                  value={formData.match_date}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setFormData({ ...formData, match_date: e.target.value })
                  }
                  size="full"
                  color="primary-100"
                />
              </div>
              <div>
                <label className="text-yds-b1 text-primary-100">홈/어웨이 *</label>
                <SelectBox size="full" selectBoxHook={editHomeAwayHook} />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-yds-b1 text-primary-100">우리 점수</label>
                  <Input
                    type="number"
                    min={0}
                    value={formData.our_score}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setFormData({ ...formData, our_score: parseInt(e.target.value) || 0 })
                    }
                    size="full"
                    color="primary-100"
                  />
                </div>
                <div>
                  <label className="text-yds-b1 text-primary-100">상대 점수</label>
                  <Input
                    type="number"
                    min={0}
                    value={formData.opponent_score}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setFormData({ ...formData, opponent_score: parseInt(e.target.value) || 0 })
                    }
                    size="full"
                    color="primary-100"
                  />
                </div>
              </div>
              <div>
                <label className="text-yds-b1 text-primary-100">포메이션</label>
                <Input
                  type="text"
                  value={formData.formation}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setFormData({ ...formData, formation: e.target.value })
                  }
                  size="full"
                  color="primary-100"
                  placeholder="예: 4-3-3"
                />
              </div>
              <div>
                <label className="text-yds-b1 text-primary-100">라운드명</label>
                <Input
                  type="text"
                  value={formData.round_name}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setFormData({ ...formData, round_name: e.target.value })
                  }
                  size="full"
                  color="primary-100"
                  placeholder="예: 1라운드"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-yds-b1 text-primary-100">경기 시작 시간</label>
                  <Input
                    type="datetime-local"
                    value={formData.match_start_time}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setFormData({ ...formData, match_start_time: e.target.value })
                    }
                    placeholder="경기 시작 시간"
                    size="full"
                    color="primary-100"
                  />
                </div>
                <div>
                  <label className="text-yds-b1 text-primary-100">후반 시작 시간</label>
                  <Input
                    type="datetime-local"
                    value={formData.second_half_start_time}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setFormData({ ...formData, second_half_start_time: e.target.value })
                    }
                    placeholder="후반 시작 시간"
                    size="full"
                    color="primary-100"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-yds-b1 text-primary-100">전반 종료 시간</label>
                  <Input
                    type="datetime-local"
                    value={formData.first_half_end_time}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setFormData({ ...formData, first_half_end_time: e.target.value })
                    }
                    placeholder="전반 종료 시간"
                    size="full"
                    color="primary-100"
                  />
                </div>
                <div>
                  <label className="text-yds-b1 text-primary-100">후반 종료 시간</label>
                  <Input
                    type="datetime-local"
                    value={formData.second_half_end_time}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setFormData({ ...formData, second_half_end_time: e.target.value })
                    }
                    placeholder="후반 종료 시간"
                    size="full"
                    color="primary-100"
                  />
                </div>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.is_live}
                  onChange={(e) => setFormData({ ...formData, is_live: e.target.checked })}
                  className="mr-2"
                />
                <label className="text-primary-100 text-sm">라이브 경기</label>
              </div>
            </div>
            <div className="mt-6 flex gap-2">
              <Button
                variant="outlined"
                color="primary"
                size="full"
                onClick={() => {
                  setEditingMatch(null);
                  resetFormData();
                }}
              >
                취소
              </Button>
              <Button
                variant="fill"
                color="primary"
                size="full"
                onClick={handleUpdateMatch}
                disabled={isUpdating || !editCompetitionHook.label || !editTeamHook.label || !formData.match_date}
              >
                {isUpdating ? "수정 중..." : "수정"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminMatch;
