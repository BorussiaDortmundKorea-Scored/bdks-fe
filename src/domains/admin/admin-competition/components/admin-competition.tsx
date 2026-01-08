/**
 * 작성자: KYD
 * 기능: 대회 관리 컴포넌트 - 대회 CRUD 기능
 * 프로세스 설명: 대회 목록 조회, 생성, 수정, 삭제 기능 제공
 */
import { Button } from "@youngduck/yd-ui";
import { useOverlay } from "@youngduck/yd-ui/Overlays";
import { TBody, THead, Table, Td, Th, Tr } from "@youngduck/yd-ui/Table";
import { Edit, FolderPlus, Trash2 } from "lucide-react";

import type { ICompetition } from "@admin/admin-competition/api/admin-competition-api";
import { useDeleteCompetition } from "@admin/admin-competition/api/react-query-api/use-delete-competition";
import { useGetAllCompetitionsSuspense } from "@admin/admin-competition/api/react-query-api/use-get-all-competitions-suspense";
import { AdminCompetitionAddModal } from "@admin/admin-competition/components/modal/admin-competition-add-modal";
import { AdminCompetitionEditModal } from "@admin/admin-competition/components/modal/admin-competition-edit-modal";

const AdminCompetition = () => {
  //SECTION HOOK호출 영역
  const { data: competitions } = useGetAllCompetitionsSuspense();
  const { mutateAsync: deleteCompetition } = useDeleteCompetition();
  const overlay = useOverlay();
  //!SECTION HOOK호출 영역

  //SECTION 상태값 영역

  //!SECTION 상태값 영역

  //SECTION 메서드 영역
  const handleDeleteCompetition = async (id: string) => {
    if (!confirm("정말로 이 대회를 삭제하시겠습니까?")) return;

    await deleteCompetition(id);
  };

  const handleOpenAddModal = () => {
    overlay.modalOpen({
      content: (onClose) => <AdminCompetitionAddModal onClose={onClose} />,
      config: { size: "sm" },
    });
  };

  const handleOpenEditModal = (competition: ICompetition) => {
    overlay.modalOpen({
      content: (onClose) => <AdminCompetitionEditModal competition={competition} onClose={onClose} />,
      config: { size: "sm" },
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
          onClick={handleOpenAddModal}
          className="flex items-center gap-2"
          aria-label="새 대회 추가"
        >
          <FolderPlus size={20} />
          대회 추가
        </Button>
      </div>

      {/* 스크롤 가능한 컨텐츠 영역 */}
      <Table scrollable={true} className="md:w-full" scrollClassName="h-[760px] w-full">
        <THead>
          <Tr>
            <Th>대회명</Th>
            <Th>시즌</Th>
            <Th>작업</Th>
          </Tr>
        </THead>
        <TBody>
          {competitions.map((competition) => (
            <Tr key={competition.id}>
              <Td>{competition.name}</Td>
              <Td>{competition.season}</Td>
              <Td>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => handleOpenEditModal(competition)}
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
              </Td>
            </Tr>
          ))}
        </TBody>
      </Table>
    </div>
  );
};

export default AdminCompetition;
