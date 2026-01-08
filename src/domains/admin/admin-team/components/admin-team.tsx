/**
 * 작성자: KYD
 * 기능: 팀 관리 컴포넌트 - 팀 CRUD 기능
 * 프로세스 설명: 팀 목록 조회, 생성, 수정, 삭제 기능 제공
 */

import { Button, Input, SelectBox, useSelectBox } from "@youngduck/yd-ui";
import { TBody, THead, Table, Td, Th, Tr } from "@youngduck/yd-ui/Table";
import { Edit, FolderPlus, Trash2 } from "lucide-react";

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
      {/* 헤더 */}
      <div className="flex w-full items-center justify-between p-4">
        <h2 className="text-yds-s1 text-primary-100">팀 관리</h2>
        <Button
          variant="outlined"
          color="primary"
          size="md"
          onClick={handleOpenAddModal}
          className="flex items-center gap-2"
          aria-label="새 팀 추가"
        >
          <FolderPlus size={20} />팀 추가
        </Button>
      </div>

      {/* 스크롤 가능한 컨텐츠 영역 */}
      <Table scrollable={true} className="md:w-full" scrollClassName="h-[760px] w-full">
        <THead>
          <Tr>
            <Th>팀명</Th>
            <Th>국가</Th>
            <Th>작업</Th>
          </Tr>
        </THead>
        <TBody>
          {teams.map((team) => (
            <Tr key={team.id}>
              <Td>{team.name}</Td>
              <Td>{team.country || "-"}</Td>
              <Td>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleOpenEditModal(team)}
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
              </Td>
            </Tr>
          ))}
        </TBody>
      </Table>
    </div>
  );
};

export default AdminTeam;
