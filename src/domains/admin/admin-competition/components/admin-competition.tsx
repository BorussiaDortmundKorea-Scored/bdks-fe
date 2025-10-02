/**
 * 작성자: KYD
 * 기능: 대회 관리 컴포넌트 - 대회 CRUD 기능
 * 프로세스 설명: 대회 목록 조회, 생성, 수정, 삭제 기능 제공
 */
import { useState } from "react";

import { Button, Input } from "@youngduck/yd-ui";
import { Edit, FolderPlus, Trash2 } from "lucide-react";

import type { ICompetition } from "@admin/admin-competition/api/admin-competition-api";
import { useCreateCompetition } from "@admin/admin-competition/api/react-query-api/use-create-competition";
import { useDeleteCompetition } from "@admin/admin-competition/api/react-query-api/use-delete-competition";
import { useGetAllCompetitionsSuspense } from "@admin/admin-competition/api/react-query-api/use-get-all-competitions-suspense";
import { useUpdateCompetition } from "@admin/admin-competition/api/react-query-api/use-update-competition";

const AdminCompetition = () => {
  //SECTION HOOK호출 영역
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
    <div className="flex h-full w-full flex-col">
      {/* 헤더 */}
      <div className="flex w-full items-center justify-between p-4">
        <h2 className="text-yds-s1 text-primary-100">대회 관리</h2>
        <Button
          variant="outlined"
          color="primary"
          size="md"
          onClick={() => setIsCreateModalOpen(true)}
          className="flex items-center gap-2"
          aria-label="새 대회 추가"
        >
          <FolderPlus size={20} />
          대회 추가
        </Button>
      </div>

      {/* 스크롤 가능한 컨텐츠 영역 */}
      <div className="scrollbar-hide border-primary-100 flex w-full flex-1 flex-col gap-4 overflow-y-auto rounded-lg border-2">
        <table className="w-full">
          <thead className="bg-background-primary text-primary-400 border-primary-100 text-yds-b1 border-b-2">
            <tr className="h-12">
              <th className="px-6 text-left uppercase">대회명</th>
              <th className="px-6 text-left uppercase">시즌</th>
              <th className="px-6 text-left uppercase">작업</th>
            </tr>
          </thead>
          <tbody className="bg-background-primary">
            {competitions.map((competition) => (
              <tr key={competition.id} className="hover:bg-primary-100/5 h-12">
                <td className="text-primary-100 px-6 py-4 text-sm font-medium whitespace-nowrap">{competition.name}</td>
                <td className="text-primary-100 px-6 py-4 text-sm whitespace-nowrap">{competition.season}</td>
                <td className="px-6 py-4 text-sm font-medium whitespace-nowrap">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => openEditModal(competition)}
                      className="text-primary-100 hover:bg-primary-100/20 cursor-pointer rounded-md p-1 transition-colors hover:text-white"
                      aria-label="수정"
                    >
                      <Edit size={16} />
                    </button>
                    <button
                      onClick={() => handleDeleteCompetition(competition.id)}
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
            <h2 className="text-yds-b1 text-primary-100">새 대회 추가</h2>
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <label className="text-yds-b1 text-primary-100">대회명</label>
                <Input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="대회명을 입력하세요"
                  size="full"
                  color="primary-100"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-yds-b1 text-primary-100">시즌</label>
                <Input
                  type="text"
                  value={formData.season}
                  onChange={(e) => setFormData({ ...formData, season: e.target.value })}
                  placeholder="시즌을 입력하세요"
                  size="full"
                  color="primary-100"
                />
              </div>
            </div>
            <div className="mt-6 flex gap-2">
              <Button variant="outlined" color="primary" size="full" onClick={() => setIsCreateModalOpen(false)}>
                취소
              </Button>
              <Button
                variant="fill"
                color="primary"
                size="full"
                onClick={handleCreateCompetition}
                disabled={!formData.name || !formData.season || isCreating}
              >
                {isCreating ? "추가 중..." : "추가"}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* 수정 모달 */}
      {editingCompetition && (
        <div className="bg-background-primary-layer fixed inset-0 z-50 flex items-center justify-center">
          <div className="bg-background-secondary flex h-[90vh] w-96 flex-col gap-4 overflow-y-auto rounded-lg p-6">
            <h2 className="text-yds-b1 text-primary-100">대회 수정</h2>
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <label className="text-yds-b1 text-primary-100">대회명</label>
                <Input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="대회명을 입력하세요"
                  size="full"
                  color="primary-100"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-yds-b1 text-primary-100">시즌</label>
                <Input
                  type="text"
                  value={formData.season}
                  onChange={(e) => setFormData({ ...formData, season: e.target.value })}
                  placeholder="시즌을 입력하세요"
                  size="full"
                  color="primary-100"
                />
              </div>
            </div>
            <div className="mt-6 flex gap-2">
              <Button variant="outlined" color="primary" size="full" onClick={() => setEditingCompetition(null)}>
                취소
              </Button>
              <Button
                variant="fill"
                color="primary"
                size="full"
                onClick={handleUpdateCompetition}
                disabled={!formData.name || !formData.season || isUpdating}
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

export default AdminCompetition;
