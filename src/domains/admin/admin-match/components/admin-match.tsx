/**
 * 작성자: KYD
 * 기능: 경기 관리 컴포넌트 - 경기 CRUD 기능
 * 프로세스 설명: 경기 목록 조회, 생성, 수정, 삭제 기능 제공 및 라인업 관리 접근
 */
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { ArrowLeft, Edit, FolderPlus, Trash2, Users } from "lucide-react";

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
  });
  //!SECTION 상태값 영역

  //SECTION 메서드 영역
  const handleCreateMatch = async () => {
    await createMatch({
      competition_id: formData.competition_id,
      opponent_team_id: formData.opponent_team_id,
      match_date: formData.match_date,
      home_away: formData.home_away,
      our_score: formData.our_score,
      opponent_score: formData.opponent_score,
      formation: formData.formation || undefined,
      is_live: formData.is_live,
      round_name: formData.round_name || undefined,
    });
    setIsCreateModalOpen(false);
    resetFormData();
  };

  const handleUpdateMatch = async () => {
    if (!editingMatch) return;

    await updateMatch({
      id: editingMatch.id,
      competition_id: formData.competition_id || undefined,
      opponent_team_id: formData.opponent_team_id || undefined,
      match_date: formData.match_date || undefined,
      home_away: formData.home_away,
      our_score: formData.our_score,
      opponent_score: formData.opponent_score,
      formation: formData.formation || undefined,
      is_live: formData.is_live,
      round_name: formData.round_name || undefined,
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
      {/* 고정된 헤더 */}
      <header className="layout-header-height bg-background-primary relative z-10 flex w-full shrink-0 items-center">
        <ArrowLeft
          size={24}
          className="text-primary-400 cursor-pointer"
          onClick={() => navigate(-1)}
          aria-label="뒤로가기"
        />
        <h1 className="text-primary-400 font-shilla-culture absolute left-1/2 -translate-x-1/2 text-2xl font-bold">
          경기 관리
        </h1>
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="border-primary-400 text-primary-400 hover:bg-primary-500 absolute right-4 flex cursor-pointer items-center gap-2 rounded-lg border px-4 py-2 transition-colors"
          aria-label="새 경기 추가"
        >
          <FolderPlus size={20} />
          경기 추가
        </button>
      </header>

      {/* 스크롤 가능한 컨텐츠 영역 - 헤더 높이를 제외한 나머지 영역 */}
      <div className="scrollbar-hide flex w-full flex-1 flex-col gap-4 overflow-y-auto">
        <table className="w-full">
          <thead className="bg-background-primary text-primary-400 border-background-secondary border-b">
            <tr>
              <th className="text-md px-6 py-3 text-left font-bold tracking-wider uppercase">경기일</th>
              <th className="text-md px-6 py-3 text-left font-bold tracking-wider uppercase">대회</th>
              <th className="text-md px-6 py-3 text-left font-bold tracking-wider uppercase">상대팀</th>
              <th className="text-md px-6 py-3 text-left font-bold tracking-wider uppercase">홈/어웨이</th>
              <th className="text-md px-6 py-3 text-left font-bold tracking-wider uppercase">스코어</th>
              <th className="text-md px-6 py-3 text-left font-bold tracking-wider uppercase">라운드</th>
              <th className="text-md px-6 py-3 text-left font-bold tracking-wider uppercase">작업</th>
            </tr>
          </thead>
          <tbody className="bg-background-primary divide-background-secondary divide-y">
            {matches.map((match) => (
              <tr
                key={match.id}
                className="hover:bg-background-secondary cursor-pointer"
                onClick={() => handleLineupManagement(match.id)}
              >
                <td className="text-primary-400 px-6 py-4 text-sm font-medium whitespace-nowrap">
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
                  <div className="flex gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleLineupManagement(match.id);
                      }}
                      className="cursor-pointer text-green-600 hover:text-green-900"
                      aria-label="라인업 관리"
                    >
                      <Users size={16} />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        openEditModal(match);
                      }}
                      className="cursor-pointer text-indigo-500 hover:text-indigo-900"
                      aria-label="수정"
                    >
                      <Edit size={16} />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteMatch(match.id);
                      }}
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
            <h2 className="mb-4 text-lg font-semibold">새 경기 추가</h2>
            <div className="space-y-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">대회 *</label>
                <select
                  value={formData.competition_id}
                  onChange={(e) => setFormData({ ...formData, competition_id: e.target.value })}
                  className="focus:ring-primary-400 w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:outline-none"
                >
                  <option value="">대회를 선택하세요</option>
                  {competitions.map((competition) => (
                    <option key={competition.id} value={competition.id}>
                      {competition.name} ({competition.season})
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">상대팀 *</label>
                <select
                  value={formData.opponent_team_id}
                  onChange={(e) => setFormData({ ...formData, opponent_team_id: e.target.value })}
                  className="focus:ring-primary-400 w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:outline-none"
                >
                  <option value="">상대팀을 선택하세요</option>
                  {teams.map((team) => (
                    <option key={team.id} value={team.id}>
                      {team.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">경기일 *</label>
                <input
                  type="date"
                  value={formData.match_date}
                  onChange={(e) => setFormData({ ...formData, match_date: e.target.value })}
                  className="focus:ring-primary-400 w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:outline-none"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">홈/어웨이 *</label>
                <select
                  value={formData.home_away}
                  onChange={(e) => setFormData({ ...formData, home_away: e.target.value as "HOME" | "AWAY" })}
                  className="focus:ring-primary-400 w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:outline-none"
                >
                  <option value="HOME">홈</option>
                  <option value="AWAY">어웨이</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">우리 점수</label>
                  <input
                    type="number"
                    min="0"
                    value={formData.our_score}
                    onChange={(e) => setFormData({ ...formData, our_score: parseInt(e.target.value) || 0 })}
                    className="focus:ring-primary-400 w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">상대 점수</label>
                  <input
                    type="number"
                    min="0"
                    value={formData.opponent_score}
                    onChange={(e) => setFormData({ ...formData, opponent_score: parseInt(e.target.value) || 0 })}
                    className="focus:ring-primary-400 w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:outline-none"
                  />
                </div>
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">포메이션</label>
                <input
                  type="text"
                  value={formData.formation}
                  onChange={(e) => setFormData({ ...formData, formation: e.target.value })}
                  className="focus:ring-primary-400 w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:outline-none"
                  placeholder="예: 4-3-3"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">라운드명</label>
                <input
                  type="text"
                  value={formData.round_name}
                  onChange={(e) => setFormData({ ...formData, round_name: e.target.value })}
                  className="focus:ring-primary-400 w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:outline-none"
                  placeholder="예: 1라운드"
                />
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.is_live}
                  onChange={(e) => setFormData({ ...formData, is_live: e.target.checked })}
                  className="mr-2"
                />
                <label className="text-sm font-medium text-gray-700">라이브 경기</label>
              </div>
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
                onClick={handleCreateMatch}
                disabled={!formData.competition_id || !formData.opponent_team_id || !formData.match_date || isCreating}
                className="bg-primary-400 hover:bg-primary-500 flex-1 rounded-md px-4 py-2 text-white disabled:opacity-50"
              >
                {isCreating ? "추가 중..." : "추가"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 수정 모달 */}
      {editingMatch && (
        <div className="bg-opacity-50 fixed inset-0 z-50 flex items-center justify-center bg-black">
          <div className="max-h-[90vh] w-96 overflow-y-auto rounded-lg bg-white p-6">
            <h2 className="mb-4 text-lg font-semibold">경기 수정</h2>
            <div className="space-y-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">대회 *</label>
                <select
                  value={formData.competition_id}
                  onChange={(e) => setFormData({ ...formData, competition_id: e.target.value })}
                  className="focus:ring-primary-400 w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:outline-none"
                >
                  <option value="">대회를 선택하세요</option>
                  {competitions.map((competition) => (
                    <option key={competition.id} value={competition.id}>
                      {competition.name} ({competition.season})
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">상대팀 *</label>
                <select
                  value={formData.opponent_team_id}
                  onChange={(e) => setFormData({ ...formData, opponent_team_id: e.target.value })}
                  className="focus:ring-primary-400 w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:outline-none"
                >
                  <option value="">상대팀을 선택하세요</option>
                  {teams.map((team) => (
                    <option key={team.id} value={team.id}>
                      {team.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">경기일 *</label>
                <input
                  type="date"
                  value={formData.match_date}
                  onChange={(e) => setFormData({ ...formData, match_date: e.target.value })}
                  className="focus:ring-primary-400 w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:outline-none"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">홈/어웨이 *</label>
                <select
                  value={formData.home_away}
                  onChange={(e) => setFormData({ ...formData, home_away: e.target.value as "HOME" | "AWAY" })}
                  className="focus:ring-primary-400 w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:outline-none"
                >
                  <option value="HOME">홈</option>
                  <option value="AWAY">어웨이</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">우리 점수</label>
                  <input
                    type="number"
                    min="0"
                    value={formData.our_score}
                    onChange={(e) => setFormData({ ...formData, our_score: parseInt(e.target.value) || 0 })}
                    className="focus:ring-primary-400 w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">상대 점수</label>
                  <input
                    type="number"
                    min="0"
                    value={formData.opponent_score}
                    onChange={(e) => setFormData({ ...formData, opponent_score: parseInt(e.target.value) || 0 })}
                    className="focus:ring-primary-400 w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:outline-none"
                  />
                </div>
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">포메이션</label>
                <input
                  type="text"
                  value={formData.formation}
                  onChange={(e) => setFormData({ ...formData, formation: e.target.value })}
                  className="focus:ring-primary-400 w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:outline-none"
                  placeholder="예: 4-3-3"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">라운드명</label>
                <input
                  type="text"
                  value={formData.round_name}
                  onChange={(e) => setFormData({ ...formData, round_name: e.target.value })}
                  className="focus:ring-primary-400 w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:outline-none"
                  placeholder="예: 1라운드"
                />
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.is_live}
                  onChange={(e) => setFormData({ ...formData, is_live: e.target.checked })}
                  className="mr-2"
                />
                <label className="text-sm font-medium text-gray-700">라이브 경기</label>
              </div>
            </div>
            <div className="mt-6 flex gap-2">
              <button
                onClick={() => {
                  setEditingMatch(null);
                  resetFormData();
                }}
                className="flex-1 rounded-md border border-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-50"
              >
                취소
              </button>
              <button
                onClick={handleUpdateMatch}
                disabled={!formData.competition_id || !formData.opponent_team_id || !formData.match_date || isUpdating}
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

export default AdminMatch;
