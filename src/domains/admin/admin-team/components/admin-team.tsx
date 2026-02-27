/**
 * 작성자: KYD
 * 기능: 팀 관리 컴포넌트 - 팀 CRUD 기능
 * 프로세스 설명: 팀 목록 조회, 생성, 수정, 삭제 기능 제공
 */
import { Button } from "@youngduck/yd-ui";
import { useOverlay } from "@youngduck/yd-ui/Overlays";
import { TBody, THead, Table, Td, Th, Tr } from "@youngduck/yd-ui/Table";
import { Edit, FolderPlus, Trash2 } from "lucide-react";

import type { ITeam } from "@admin/admin-team/api/admin-team-api";
import { useDeleteTeam } from "@admin/admin-team/api/react-query-api/use-delete-team";
import { useGetAllTeamsSuspense } from "@admin/admin-team/api/react-query-api/use-get-all-teams-suspense";
import { AdminTeamAddModal } from "@admin/admin-team/components/modal/admin-team-add-modal";
import { AdminTeamEditModal } from "@admin/admin-team/components/modal/admin-team-edit-modal";

const AdminTeam = () => {
  //SECTION HOOK호출 영역
  const { data: teams } = useGetAllTeamsSuspense();
  const { mutateAsync: deleteTeam } = useDeleteTeam();
  const overlay = useOverlay();
  //!SECTION HOOK호출 영역

  //SECTION 상태값 영역

  //!SECTION 상태값 영역

  //SECTION 메서드 영역
  const handleDeleteTeam = async (id: string) => {
    if (!confirm("정말로 이 팀을 삭제하시겠습니까?")) return;
    await deleteTeam(id);
  };

  const handleOpenAddModal = () => {
    overlay.modalOpen({
      content: (onClose) => <AdminTeamAddModal onClose={onClose} />,
      config: { size: "sm" },
    });
  };

  const handleOpenEditModal = (team: ITeam) => {
    overlay.modalOpen({
      content: (onClose) => <AdminTeamEditModal team={team} onClose={onClose} />,
      config: { size: "sm" },
    });
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
            <Th>로고</Th>
            <Th>국가</Th>
            <Th>작업</Th>
          </Tr>
        </THead>
        <TBody>
          {teams.map((team) => (
            <Tr key={team.id}>
              <Td>{team.name}</Td>
              <Td>
                {team.logo_image_url ? (
                  <img
                    src={team.logo_image_url}
                    alt={`${team.name} 로고`}
                    className="h-30 w-30 rounded-md object-contain"
                  />
                ) : (
                  "-"
                )}
              </Td>
              <Td>{team.country || "-"}</Td>
              <Td>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => handleOpenEditModal(team)}
                    className="text-primary-100 hover:bg-primary-100/20 cursor-pointer rounded-md p-1 transition-colors hover:text-white"
                    aria-label="수정"
                  >
                    <Edit size={16} />
                  </button>
                  <button
                    onClick={() => handleDeleteTeam(team.id)}
                    className="cursor-pointer rounded-md p-1 text-red-400 transition-colors hover:bg-red-500/20 hover:text-white"
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
