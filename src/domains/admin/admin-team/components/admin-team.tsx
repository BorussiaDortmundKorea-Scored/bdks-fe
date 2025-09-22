/**
 * 작성자: KYD
 * 기능: 팀 관리 컴포넌트 - 팀 CRUD 기능
 * 프로세스 설명: 팀 목록 조회, 생성, 수정, 삭제 기능 제공
 */
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { Button, Input, SelectBox, useSelectBox } from "@youngduck/yd-ui";
import { ArrowLeft, Edit, FolderPlus, Trash2 } from "lucide-react";

import type { ITeam } from "@admin/admin-team/api/admin-team-api";
import { useCreateTeam } from "@admin/admin-team/api/react-query-api/use-create-team";
import { useDeleteTeam } from "@admin/admin-team/api/react-query-api/use-delete-team";
import { useGetAllTeamsSuspense } from "@admin/admin-team/api/react-query-api/use-get-all-teams-suspense";
import { useUpdateTeam } from "@admin/admin-team/api/react-query-api/use-update-team";

// 국가 옵션 데이터. 하드코딩중
const countryOptions = [
  { label: "독일", value: "독일" },
  { label: "스페인", value: "스페인" },
  { label: "이탈리아", value: "이탈리아" },
  { label: "프랑스", value: "프랑스" },
  { label: "영국", value: "영국" },
  { label: "네덜란드", value: "네덜란드" },
  { label: "포르투갈", value: "포르투갈" },
];

const AdminTeam = () => {
  //SECTION HOOK호출 영역
  const navigate = useNavigate();
  const { data: teams } = useGetAllTeamsSuspense();
  const { mutateAsync: createTeam, isPending: isCreating } = useCreateTeam();
  const { mutateAsync: updateTeam, isPending: isUpdating } = useUpdateTeam();
  const { mutateAsync: deleteTeam } = useDeleteTeam();

  const createCountrySelectHook = useSelectBox({
    options: countryOptions,
    search: true,
    defaultValue: "독일",
  });

  const editCountrySelectHook = useSelectBox({
    options: countryOptions,
    search: true,
    defaultValue: "독일",
  });
  //!SECTION HOOK호출 영역

  //SECTION 상태값 영역
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingTeam, setEditingTeam] = useState<ITeam | null>(null);
  const [formData, setFormData] = useState({
    name: "",
  });
  //!SECTION 상태값 영역

  //SECTION 메서드 영역
  const handleCreateTeam = async () => {
    await createTeam({
      name: formData.name,
      country: createCountrySelectHook.value,
    });
    setIsCreateModalOpen(false);
    setFormData({ name: "" });
  };

  const handleUpdateTeam = async () => {
    if (!editingTeam) return;

    await updateTeam({
      id: editingTeam.id,
      name: formData.name || undefined,
      country: editCountrySelectHook.value,
    });
    setEditingTeam(null);
    setFormData({ name: "" });
  };

  const handleDeleteTeam = async (id: string) => {
    if (!confirm("정말로 이 팀을 삭제하시겠습니까?")) return;
    await deleteTeam(id);
  };

  const openEditModal = (team: ITeam) => {
    setEditingTeam(team);
    setFormData({
      name: team.name,
    });
    // SelectBox에 기존 값 설정
    if (team.country) {
      const countryOption = countryOptions.find((opt) => opt.value === team.country);
      if (countryOption) {
        editCountrySelectHook.handleClickOption(countryOption);
      }
    }
  };

  const handleCreateModalClose = () => {
    setIsCreateModalOpen(false);
    setFormData({ name: "" });
  };

  const handleEditModalClose = () => {
    setEditingTeam(null);
    setFormData({ name: "" });
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
          팀 관리
        </h1>
        {/* 🔥 yd-ui Button으로 교체 */}
        <Button
          variant="outlined"
          color="primary"
          size="md"
          onClick={() => setIsCreateModalOpen(true)}
          className="absolute right-4 flex items-center gap-2"
          aria-label="새 팀 추가"
        >
          <FolderPlus size={20} />팀 추가
        </Button>
      </header>

      {/* 스크롤 가능한 컨텐츠 영역 */}
      <div className="scrollbar-hide border-primary-100 my-4 flex w-full flex-1 flex-col gap-4 overflow-y-auto rounded-lg border-2">
        <table className="w-full">
          <thead className="bg-background-primary text-primary-400 border-primary-100 text-yds-b1 border-b-2">
            <tr className="h-12">
              <th className="px-6 text-left uppercase">팀명</th>
              <th className="px-6 text-left uppercase">국가</th>
              <th className="px-6 text-left uppercase">작업</th>
            </tr>
          </thead>
          <tbody className="bg-background-primary">
            {teams.map((team) => (
              <tr key={team.id} className="hover:bg-primary-300 h-12">
                <td className="text-primary-400 px-6 py-4 text-sm font-medium whitespace-nowrap">{team.name}</td>
                <td className="text-primary-100 px-6 py-4 text-sm whitespace-nowrap">{team.country || "-"}</td>
                <td className="px-6 py-4 text-sm font-medium whitespace-nowrap">
                  <div className="flex gap-2">
                    <button
                      onClick={() => openEditModal(team)}
                      className="cursor-pointer text-indigo-500 hover:text-indigo-900"
                      aria-label="수정"
                    >
                      <Edit size={16} />
                    </button>
                    <button
                      onClick={() => handleDeleteTeam(team.id)}
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

      {/* 🔥 생성 모달 - yd-ui 컴포넌트들로 교체 */}
      {isCreateModalOpen && (
        <div className="bg-background-primary-layer fixed inset-0 z-50 flex items-center justify-center">
          <div className="bg-background-secondary flex h-[90vh] w-96 flex-col gap-4 overflow-y-auto rounded-lg p-6">
            <h2 className="text-yds-b1 text-primary-100">새 팀 추가</h2>
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <label className="text-yds-b1 text-primary-100">팀명</label>
                <Input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="팀명을 입력하세요"
                  size="full"
                  color="primary-100"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-yds-b1 text-primary-100">국가</label>
                <SelectBox size="full" selectBoxHook={createCountrySelectHook} />
              </div>
            </div>
            <div className="mt-6 flex gap-2">
              <Button variant="outlined" color="primary" size="full" onClick={handleCreateModalClose}>
                취소
              </Button>
              <Button
                variant="fill"
                color="primary"
                size="full"
                onClick={handleCreateTeam}
                disabled={!formData.name || isCreating}
              >
                {isCreating ? "추가 중..." : "추가"}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* 🔥 수정 모달 - 생성 모달과 동일한 디자인 */}
      {editingTeam && (
        <div className="bg-background-primary-layer fixed inset-0 z-50 flex items-center justify-center">
          <div className="bg-background-secondary flex h-[90vh] w-96 flex-col gap-4 overflow-y-auto rounded-lg p-6">
            <h2 className="text-yds-b1 text-primary-100">팀 수정</h2>
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <label className="text-yds-b1 text-primary-100">팀명</label>
                <Input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="팀명을 입력하세요"
                  size="full"
                  color="primary-100"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-yds-b1 text-primary-100">국가</label>
                <SelectBox size="full" selectBoxHook={editCountrySelectHook} />
              </div>
            </div>
            <div className="mt-6 flex gap-2">
              <Button variant="outlined" color="primary" size="full" onClick={handleEditModalClose}>
                취소
              </Button>
              <Button
                variant="fill"
                color="primary"
                size="full"
                onClick={handleUpdateTeam}
                disabled={!formData.name || isUpdating}
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

export default AdminTeam;
