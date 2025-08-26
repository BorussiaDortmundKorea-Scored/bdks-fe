/**
 * 작성자: KYD
 * 기능: 팀 관리 컴포넌트 - 팀 CRUD 기능
 * 프로세스 설명: 팀 목록 조회, 생성, 수정, 삭제 기능 제공
 */
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { ArrowLeft, Edit, FolderPlus, Trash2 } from "lucide-react";

import type { ITeam } from "@admin/admin-team/api/admin-team-api";
import { useCreateTeam } from "@admin/admin-team/api/react-query-api/use-create-team";
import { useDeleteTeam } from "@admin/admin-team/api/react-query-api/use-delete-team";
import { useGetAllTeamsSuspense } from "@admin/admin-team/api/react-query-api/use-get-all-teams-suspense";
import { useUpdateTeam } from "@admin/admin-team/api/react-query-api/use-update-team";

const AdminTeam = () => {
  //SECTION HOOK호출 영역
  const navigate = useNavigate();
  const { data: teams } = useGetAllTeamsSuspense();
  const { mutateAsync: createTeam, isPending: isCreating } = useCreateTeam();
  const { mutateAsync: updateTeam, isPending: isUpdating } = useUpdateTeam();
  const { mutateAsync: deleteTeam } = useDeleteTeam();
  //!SECTION HOOK호출 영역

  //SECTION 상태값 영역
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingTeam, setEditingTeam] = useState<ITeam | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    country: "",
  });
  //!SECTION 상태값 영역

  //SECTION 메서드 영역
  const handleCreateTeam = async () => {
    await createTeam({
      name: formData.name,
      country: formData.country || undefined,
    });
    setIsCreateModalOpen(false);
    setFormData({
      name: "",
      country: "",
    });
  };

  const handleUpdateTeam = async () => {
    if (!editingTeam) return;

    await updateTeam({
      id: editingTeam.id,
      name: formData.name || undefined,
      country: formData.country || undefined,
    });
    setEditingTeam(null);
    setFormData({
      name: "",
      country: "",
    });
  };

  const handleDeleteTeam = async (id: string) => {
    if (!confirm("정말로 이 팀을 삭제하시겠습니까?")) return;

    await deleteTeam(id);
  };

  const openEditModal = (team: ITeam) => {
    setEditingTeam(team);
    setFormData({
      name: team.name,
      country: team.country || "",
    });
  };
  //!SECTION 메서드 영역

  return (
    <div className="w-full flex flex-col h-full">
      {/* 고정된 헤더 */}
      <header className="w-full flex layout-header-height items-center relative shrink-0 bg-background-primary z-10">
        <ArrowLeft
          size={24}
          className="text-primary-400 cursor-pointer"
          onClick={() => navigate(-1)}
          aria-label="뒤로가기"
        />
        <h1 className="text-primary-400 font-shilla-culture absolute left-1/2 -translate-x-1/2 text-2xl font-bold">
          팀 관리
        </h1>
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="absolute right-4 border border-primary-400 cursor-pointer text-primary-400 px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-primary-500 transition-colors"
          aria-label="새 팀 추가"
        >
          <FolderPlus size={20} />팀 추가
        </button>
      </header>

      {/* 스크롤 가능한 컨텐츠 영역 - 헤더 높이를 제외한 나머지 영역 */}
      <div className="w-full flex-1 flex flex-col gap-4 overflow-y-auto scrollbar-hide">
        <table className="w-full">
          <thead className="bg-background-primary text-primary-400 border-b border-background-secondary">
            <tr>
              <th className="px-6 py-3 text-left text-md font-bold uppercase tracking-wider">팀명</th>
              <th className="px-6 py-3 text-left text-md font-bold uppercase tracking-wider">국가</th>
              <th className="px-6 py-3 text-left text-md font-bold uppercase tracking-wider">작업</th>
            </tr>
          </thead>
          <tbody className="bg-background-primary divide-y divide-background-secondary">
            {teams.map((team) => (
              <tr key={team.id} className="hover:bg-background-secondary">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-primary-400">{team.name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-primary-100">{team.country || "-"}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex gap-2">
                    <button
                      onClick={() => openEditModal(team)}
                      className="text-indigo-500 hover:text-indigo-900 cursor-pointer"
                      aria-label="수정"
                    >
                      <Edit size={16} />
                    </button>
                    <button
                      onClick={() => handleDeleteTeam(team.id)}
                      className="text-red-600 hover:text-red-900 cursor-pointer"
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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96 max-h-[90vh] overflow-y-auto">
            <h2 className="text-lg font-semibold mb-4">새 팀 추가</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">팀명 *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-400"
                  placeholder="팀명을 입력하세요"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">국가</label>
                <input
                  type="text"
                  value={formData.country}
                  onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-400"
                  placeholder="국가를 입력하세요"
                />
              </div>
            </div>
            <div className="flex gap-2 mt-6">
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                취소
              </button>
              <button
                onClick={handleCreateTeam}
                disabled={!formData.name || isCreating}
                className="flex-1 px-4 py-2 bg-primary-400 text-white rounded-md hover:bg-primary-500 disabled:opacity-50"
              >
                {isCreating ? "추가 중..." : "추가"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 수정 모달 */}
      {editingTeam && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96 max-h-[90vh] overflow-y-auto">
            <h2 className="text-lg font-semibold mb-4">팀 수정</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">팀명 *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-400"
                  placeholder="팀명을 입력하세요"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">국가</label>
                <input
                  type="text"
                  value={formData.country}
                  onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-400"
                  placeholder="국가를 입력하세요"
                />
              </div>
            </div>
            <div className="flex gap-2 mt-6">
              <button
                onClick={() => setEditingTeam(null)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                취소
              </button>
              <button
                onClick={handleUpdateTeam}
                disabled={!formData.name || isUpdating}
                className="flex-1 px-4 py-2 bg-primary-400 text-white rounded-md hover:bg-primary-500 disabled:opacity-50"
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

export default AdminTeam;
