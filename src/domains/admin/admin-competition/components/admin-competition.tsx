/**
 * 작성자: KYD
 * 기능: 대회 관리 컴포넌트 - 대회 CRUD 기능
 * 프로세스 설명: 대회 목록 조회, 생성, 수정, 삭제 기능 제공
 */
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { ArrowLeft, Edit, FolderPlus, Trash2 } from "lucide-react";

import type { ICompetition } from "@admin/admin-competition/api/admin-competition-api";
import { useCreateCompetition } from "@admin/admin-competition/api/react-query-api/use-create-competition";
import { useDeleteCompetition } from "@admin/admin-competition/api/react-query-api/use-delete-competition";
import { useGetAllCompetitionsSuspense } from "@admin/admin-competition/api/react-query-api/use-get-all-competitions-suspense";
import { useUpdateCompetition } from "@admin/admin-competition/api/react-query-api/use-update-competition";

const AdminCompetition = () => {
  //SECTION HOOK호출 영역
  const navigate = useNavigate();
  const { data: competitions } = useGetAllCompetitionsSuspense();
  const { mutateAsync: createCompetition, isPending: isCreating } = useCreateCompetition();
  const { mutateAsync: updateCompetition, isPending: isUpdating } = useUpdateCompetition();
  const { mutateAsync: deleteCompetition } = useDeleteCompetition();
  //!SECTION HOOK호출 영역

  //SECTION 상태값 영역
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingCompetition, setEditingCompetition] = useState<ICompetition | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    season: "",
  });
  //!SECTION 상태값 영역

  //SECTION 메서드 영역
  const handleCreateCompetition = async () => {
    await createCompetition({
      name: formData.name,
      season: formData.season,
    });
    setIsCreateModalOpen(false);
    setFormData({
      name: "",
      season: "",
    });
  };

  const handleUpdateCompetition = async () => {
    if (!editingCompetition) return;

    await updateCompetition({
      id: editingCompetition.id,
      name: formData.name || undefined,
      season: formData.season || undefined,
    });
    setEditingCompetition(null);
    setFormData({
      name: "",
      season: "",
    });
  };

  const handleDeleteCompetition = async (id: string) => {
    if (!confirm("정말로 이 대회를 삭제하시겠습니까?")) return;

    await deleteCompetition(id);
  };

  const openEditModal = (competition: ICompetition) => {
    setEditingCompetition(competition);
    setFormData({
      name: competition.name,
      season: competition.season,
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
          대회 관리
        </h1>
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="absolute right-4 border border-primary-400 cursor-pointer text-primary-400 px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-primary-500 transition-colors"
          aria-label="새 대회 추가"
        >
          <FolderPlus size={20} />
          대회 추가
        </button>
      </header>

      {/* 스크롤 가능한 컨텐츠 영역 - 헤더 높이를 제외한 나머지 영역 */}
      <div className="w-full flex-1 flex flex-col gap-4 overflow-y-auto scrollbar-hide">
        <table className="w-full">
          <thead className="bg-background-primary text-primary-400 border-b border-background-secondary">
            <tr>
              <th className="px-6 py-3 text-left text-md font-bold uppercase tracking-wider">대회명</th>
              <th className="px-6 py-3 text-left text-md font-bold uppercase tracking-wider">시즌</th>
              <th className="px-6 py-3 text-left text-md font-bold uppercase tracking-wider">작업</th>
            </tr>
          </thead>
          <tbody className="bg-background-primary divide-y divide-background-secondary">
            {competitions.map((competition) => (
              <tr key={competition.id} className="hover:bg-background-secondary">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-primary-400">{competition.name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-primary-100">{competition.season}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex gap-2">
                    <button
                      onClick={() => openEditModal(competition)}
                      className="text-indigo-500 hover:text-indigo-900 cursor-pointer"
                      aria-label="수정"
                    >
                      <Edit size={16} />
                    </button>
                    <button
                      onClick={() => handleDeleteCompetition(competition.id)}
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
            <h2 className="text-lg font-semibold mb-4">새 대회 추가</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">대회명 *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-400"
                  placeholder="대회명을 입력하세요"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">시즌 *</label>
                <input
                  type="text"
                  value={formData.season}
                  onChange={(e) => setFormData({ ...formData, season: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-400"
                  placeholder="시즌을 입력하세요"
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
                onClick={handleCreateCompetition}
                disabled={!formData.name || !formData.season || isCreating}
                className="flex-1 px-4 py-2 bg-primary-400 text-white rounded-md hover:bg-primary-500 disabled:opacity-50"
              >
                {isCreating ? "추가 중..." : "추가"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 수정 모달 */}
      {editingCompetition && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96 max-h-[90vh] overflow-y-auto">
            <h2 className="text-lg font-semibold mb-4">대회 수정</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">대회명 *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-400"
                  placeholder="대회명을 입력하세요"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">시즌 *</label>
                <input
                  type="text"
                  value={formData.season}
                  onChange={(e) => setFormData({ ...formData, season: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-400"
                  placeholder="시즌을 입력하세요"
                />
              </div>
            </div>
            <div className="flex gap-2 mt-6">
              <button
                onClick={() => setEditingCompetition(null)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                취소
              </button>
              <button
                onClick={handleUpdateCompetition}
                disabled={!formData.name || !formData.season || isUpdating}
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

export default AdminCompetition;
